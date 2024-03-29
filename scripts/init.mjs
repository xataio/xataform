// @ts-check
import {
  intro,
  outro,
  text,
  select,
  isCancel,
  cancel,
  confirm,
  spinner,
} from "@clack/prompts";
import { XataApiClient } from "@xata.io/client";
import { readFile, writeFile } from "node:fs/promises";
import { generate } from "@xata.io/codegen";

async function main() {
  intro("XataForm init");

  // Read dotenv
  let dotEnv = "";
  try {
    dotEnv = await readFile(".env.local", "utf-8");
  } catch {}

  // Xata token
  let xataToken = "";

  dotEnv.split("\n").forEach((line) => {
    if (line.trim().startsWith("XATA_API_KEY=")) {
      xataToken = line.trim().split("=")[1];
    }
  });

  if (!xataToken) {
    const providedKey = await text({
      message: "Please provide a Xata API key",
    });
    if (isCancel(providedKey)) {
      cancel("Operation cancelled");
      process.exit(0);
    }
    xataToken = providedKey;

    if (
      (await confirm({
        message:
          "Do you want to store the key in .env.local file? (required to have project working)",
      })) === true
    ) {
      writeFile(
        ".env.local",
        dotEnv.trim() +
          `${
            dotEnv.trim().split("\n").length > 1 ? "\n\n" : ""
          }# Xata\nXATA_API_KEY=${xataToken}`
      );
    }
  }

  const xata = new XataApiClient({
    apiKey: xataToken,
  });

  // Workspace
  const { workspaces } = await xata.workspaces.getWorkspacesList();
  /** @type {"new"|string|symbol} */
  let workspace = await select({
    message: "Select a workspace",
    options: [
      { value: "new", label: "<Create a new workspace>" },
      ...workspaces.map((w) => ({
        value: w.id,
        label: w.name,
      })),
    ],
  });

  if (isCancel(workspace)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  if (workspace === "new") {
    const newWorkspaceName = await text({
      message: "Workspace name?",
    });

    if (isCancel(newWorkspaceName)) {
      cancel("Operation cancelled");
      process.exit(0);
    }

    const createdWorkspace = await xata.workspaces.createWorkspace({
      data: {
        name: newWorkspaceName,
      },
    });

    workspace = createdWorkspace.id;
  }

  const { regions } = await xata.database.listRegions({
    workspace,
  });

  // Region
  const region = await select({
    message: "Select a region",
    options: regions.map((r) => ({ value: r.id })),
  });

  if (isCancel(region)) {
    cancel("Operation cancelled");
    process.exit(0);
  }

  // Create databases
  const xataformDbSpinner = spinner();
  xataformDbSpinner.start("Creating xataform database");
  await xata.database.createDatabase({
    workspace,
    database: "xataform",
    data: {
      region,
    },
  });
  xataformDbSpinner.stop("Created xataform database");

  // Create tables
  const schema = JSON.parse(await readFile("xata.schema.json", "utf-8"));
  const createTablesSpinner = spinner();
  createTablesSpinner.start("Create tables");
  const migration = await xata.migrations.compareBranchWithUserSchema({
    branch: "main",
    database: "xataform",
    region,
    workspace,
    schema,
  });
  await xata.migrations.applyBranchSchemaEdit({
    branch: "main",
    database: "xataform",
    region,
    workspace,
    edits: migration.edits,
  });
  createTablesSpinner.stop("Created tables");

  // Update .xatarc
  const xataRcSpinner = spinner();
  xataRcSpinner.start("Creating .xatarc");
  await writeFile(
    ".xatarc",
    JSON.stringify(
      {
        databaseURL: `https://${workspace}.${region}.xata.sh/db/xataform`,
        codegen: {
          output: "utils/xata.ts",
        },
      },
      null,
      2
    )
  );
  xataRcSpinner.stop("Created .xatarc");

  // Generate xata types
  const xataCodegenSpinner = spinner();
  xataCodegenSpinner.start("Generating utils/xata.ts");

  const { typescript } = await generate({
    databaseURL: `https://${workspace}.${region}.xata.sh/db/xataform`,
    language: "typescript",
    schema,
  });
  await writeFile("utils/xata.ts", typescript);

  xataCodegenSpinner.stop("Generated utils/xata.ts");

  outro("You are ready to go! Run `pnpm dev` to try out!");
}

main().catch(console.error);

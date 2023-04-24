// @ts-check
import {
  intro,
  outro,
  text,
  isCancel,
  cancel,
  confirm,
  spinner,
} from "@clack/prompts";
import { XataApiClient } from "@xata.io/client";
import { readFile, writeFile } from "node:fs/promises";
import { generate } from "@xata.io/codegen";
import { schema } from "../xata.schema.mjs";
import { workspace, region } from "./config.mjs";

async function main() {
  intro("XataForm push schema");

  // Read dotenv
  let dotEnv = "";
  try {
    dotEnv = await readFile(".env", "utf-8");
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
          "Do you want to store the key in .env file? (required to have project working)",
      })) === true
    ) {
      writeFile(
        ".env",
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

  // Create tables
  const applyMigration = spinner();
  applyMigration.start("Apply migration");
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
  applyMigration.stop("Migration done");

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

  outro("Everything is now up-to-date!");
}

main().catch(console.error);

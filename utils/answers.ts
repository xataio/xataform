import { buildClient } from "@xata.io/client";

const Client = buildClient();
export const answersDatabase = new Client<Record<string, any>>({
  databaseURL: "https://XataForm-kh171g.eu-west-1.xata.sh/db/xataform-answers",
});

export const answersDatabaseOptions = {
  branch: process.env.XATA_BRANCH || "main",
  database: "xataform-answers",
  region: "eu-west-1",
  workspace: "XataForm-kh171g",
};

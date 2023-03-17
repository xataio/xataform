import { camel } from "case";
import { Question } from "server/routers/question/question.schemas";

type Column = {
  name: string;
  type:
    | "bool"
    | "int"
    | "float"
    | "string"
    | "text"
    | "email"
    | "multiple"
    | "link"
    | "object"
    | "datetime";
  columns?: Column[];
};

export function getXataColumn(question: Question): Column | undefined {
  const name = question.order + "-" + camel(question.title);
  switch (question.type) {
    case "multipleChoice":
      return { name, type: "multiple" };
    case "contactInfo":
      return {
        name,
        type: "object",
        columns: [
          { name: "firstName", type: "string" },
          { name: "lastName", type: "string" },
          { name: "phoneNumber", type: "string" },
          { name: "company", type: "string" },
          { name: "email", type: "string" },
        ],
      };
    case "address":
      return {
        name,
        type: "object",
        columns: [
          { name: "address", type: "string" },
          { name: "address2", type: "string" },
          { name: "cityTown", type: "string" },
          { name: "zipCode", type: "string" },
          { name: "stateRegionProvince", type: "string" },
          { name: "country", type: "string" },
        ],
      };
    case "phoneNumber":
      return { name, type: "string" };
    case "shortText":
      return { name, type: "string" };
    case "longText":
      return { name, type: "text" };
    case "statement":
      return undefined;
    case "ranking":
      return { name, type: "multiple" };
    case "yesNo":
      return { name, type: "bool" };
    case "email":
      return { name, type: "string" };
    case "opinionScale":
      return { name, type: "int" };
    case "rating":
      return { name, type: "int" };
    case "matrix":
      return {
        name,
        type: "object",
        columns: question.rows.map((row) => ({
          name: row,
          type: question.multipleSelection ? "multiple" : "string",
        })),
      };
    case "date":
      return { name, type: "datetime" };
    case "number":
      return { name, type: "int" };
    case "dropdown":
      return { name, type: "string" };
    case "legal":
      return { name, type: "bool" };
    case "website":
      return { name, type: "string" };
  }
}

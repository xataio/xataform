import { Logic, logicSchema } from "./logic.schemas";
import { nanoid } from "nanoid";

type LogicRecord = Nullable<{
  id: string;
  action: string;
  operation: string;
  value: string;
  key: string;
  to: {
    id: string;
  };
  question: {
    id: string;
    type: string;
  };
  parentRule: {
    id: string;
  };
}>;

type Nullable<T extends {}> = {
  [Property in keyof T]: T[Property] | null | undefined;
};

export function fromXataRecords(payload: LogicRecord[]) {
  // Array -> Record<questionId, Action[]>
  let raw: any = {};
  let ands: any = {};

  payload.forEach((record) => {
    if (!record.id) return;
    if (
      record.action === "jump" &&
      record.question &&
      typeof record.value === "string" &&
      record.parentRule === null
    ) {
      raw[record.question.id] = [
        ...(raw[record.question.id] ?? []),
        {
          action: "jump",
          questionType: record.question.type,
          operation: record.operation,
          value: ["number", "opinionScale", "rating"].includes(
            record.question.type
          )
            ? Number.parseInt(record.value)
            : record.question.type === "legal"
            ? Boolean(record.value)
            : record.value,
          to: record.to?.id,
          key: record.key,
        },
      ];
    } else if (record.operation === "and" && record.question) {
      if (!ands[record.id]) {
        ands[record.id] = {
          operation: "and",
          rules: [],
        };
      }

      raw[record.question.id] = [
        ...(raw[record.question.id] ?? []),
        ands[record.id],
      ];
    } else if (
      record.action === "jump" &&
      record.parentRule &&
      record.question &&
      typeof record.value === "string"
    ) {
      if (!ands[record.parentRule.id]) {
        ands[record.parentRule.id] = {
          operation: "and",
          rules: [],
        };
      }

      ands[record.parentRule.id].rules.push({
        action: "jump",
        questionType: record.question.type,
        operation: record.operation,
        value: ["number", "opinionScale", "rating"].includes(
          record.question.type
        )
          ? Number.parseInt(record.value)
          : record.question.type === "legal"
          ? Boolean(record.value)
          : record.value,
        to: record.to?.id,
        key: record.key,
      });
    }
  });

  // Validate with zod schema
  return logicSchema.parse(raw);
}

export function toXataRecords(payload: Logic[number], questionId: string) {
  const records: Array<{
    id: string;
    action?: string;
    operation: string;
    value?: string;
    key?: string;
    to?: string;
    question: string;
    parentRule?: string;
  }> = [];

  payload.forEach((rule) => {
    if (rule.operation === "and") {
      const id = `rec_${nanoid(20)}`;
      records.push({
        id,
        operation: "and",
        question: questionId,
      });

      rule.rules.forEach((subRule) => {
        records.push({
          id: `rec_${nanoid(20)}`,
          operation: subRule.operation,
          value: String(subRule.value),
          action: subRule.action,
          question: questionId,
          parentRule: id,
          key: "key" in subRule ? subRule.key : undefined,
          to: subRule.to,
        });
      });
    } else {
      records.push({
        id: `rec_${nanoid(20)}`,
        operation: rule.operation,
        action: rule.action,
        value: String(rule.value),
        question: questionId,
        key: "key" in rule ? rule.key : undefined,
        to: rule.to,
      });
    }
  });

  return records;
}

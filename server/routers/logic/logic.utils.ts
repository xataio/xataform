import { Logic, Rules, logicSchema } from "./logic.schemas";
import { nanoid } from "nanoid";
import isBefore from "date-fns/isBefore";
import isAfter from "date-fns/isAfter";

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

/**
 * Apply question rules.
 *
 * @param rules Rules related to the current question
 * @param answer User answer
 * @returns id of the next question or null if no rules
 */
export function applyRules(
  rules: Rules,
  answer: string | number | boolean | string[] | Record<string, string>
): string | null {
  for (const rule of rules) {
    if (rule.operation === "and") {
      const combinedResult = rule.rules.reduce((mem, r, i) => {
        if (i === 0) return applyRules([r], answer);
        const result = applyRules([r], answer);
        if (result === mem) return mem;
        return null;
      }, null as string | null);

      if (combinedResult !== null) {
        return combinedResult;
      }
      continue;
    }

    // String rules
    const isStringQuestion =
      rule.questionType === "shortText" ||
      rule.questionType === "phoneNumber" ||
      rule.questionType === "longText" ||
      rule.questionType === "email" ||
      rule.questionType === "dropdown" ||
      rule.questionType === "website";

    if (isStringQuestion && typeof answer === "string") {
      const value = rule.value.toLowerCase();
      const strAnswer = answer.toLowerCase();
      if (
        (rule.operation === "equal" && value === strAnswer) ||
        (rule.operation === "notEqual" && value !== strAnswer) ||
        (rule.operation === "beginsWith" && strAnswer.startsWith(value)) ||
        (rule.operation === "endsWith" && strAnswer.endsWith(value)) ||
        (rule.operation === "contains" && strAnswer.includes(value)) ||
        (rule.operation === "notContains" && !strAnswer.includes(value))
      ) {
        return rule.to;
      }
    }

    // Number rules
    const isNumberQuestion =
      rule.questionType === "number" ||
      rule.questionType === "opinionScale" ||
      rule.questionType === "rating";

    if (
      isNumberQuestion &&
      typeof answer === "number" &&
      Number.isFinite(answer)
    ) {
      if (
        (rule.operation === "equal" && rule.value === answer) ||
        (rule.operation === "notEqual" && rule.value !== answer) ||
        (rule.operation === "lowerThan" && rule.value > answer) ||
        (rule.operation === "lowerEqualThan" && rule.value >= answer) ||
        (rule.operation === "greaterThan" && rule.value < answer) ||
        (rule.operation === "greaterEqualThan" && rule.value <= answer)
      ) {
        return rule.to;
      }
    }

    // Ranking
    if (rule.questionType === "ranking" && Array.isArray(answer)) {
      const selectedAnswer = (answer[rule.index] || "").toLowerCase();
      const value = rule.value;
      if (
        (rule.operation === "equal" && value === selectedAnswer) ||
        (rule.operation === "notEqual" && value !== selectedAnswer) ||
        (rule.operation === "beginsWith" && selectedAnswer.startsWith(value)) ||
        (rule.operation === "endsWith" && selectedAnswer.endsWith(value)) ||
        (rule.operation === "contains" && selectedAnswer.includes(value)) ||
        (rule.operation === "notContains" && !selectedAnswer.includes(value))
      ) {
        return rule.to;
      }
    }

    // Choice
    if (
      rule.questionType === "multipleChoice" ||
      rule.questionType === "legal"
    ) {
      if (
        (rule.operation === "is" && rule.value === answer) ||
        (rule.operation === "isNot" && rule.value !== answer)
      ) {
        return rule.to;
      }
    }

    // Matrix
    if (
      rule.questionType === "matrix" &&
      typeof answer === "object" &&
      !Array.isArray(answer)
    ) {
      if (
        (rule.operation === "is" && rule.value === answer[rule.key]) ||
        (rule.operation === "isNot" && rule.value !== answer[rule.key])
      ) {
        return rule.to;
      }
    }

    // Date
    if (rule.questionType === "date" && typeof answer === "string") {
      if (
        (rule.operation === "on" && answer === rule.value) ||
        (rule.operation === "earlierThanOrOn" && answer === rule.value) ||
        (rule.operation === "laterThanOrOn" && answer === rule.value) ||
        (rule.operation === "notOn" && answer !== rule.value) ||
        (rule.operation === "earlierThan" &&
          isBefore(new Date(answer), new Date(rule.value))) ||
        (rule.operation === "laterThan" &&
          isAfter(new Date(answer), new Date(rule.value)))
      ) {
        return rule.to;
      }
    }
  }

  return null;
}

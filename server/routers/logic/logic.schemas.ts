import { z } from "zod";

const questionId = z.string();

const contactInfoRuleSchema = z.object({
  questionType: z.literal("contactInfo"),
  key: z.enum(["firstName", "lastName", "phoneNumber", "email", "company"]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "equal",
    "notEqual",
    "beginsWith",
    "endsWith",
    "contains",
    "notContains",
  ]),
  value: z.string(),
});

const addressRuleSchema = z.object({
  questionType: z.literal("address"),
  key: z.enum([
    "address",
    "address2",
    "cityTown",
    "stateRegionProvince",
    "zipCode",
    "country",
  ]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "equal",
    "notEqual",
    "beginsWith",
    "endsWith",
    "contains",
    "notContains",
  ]),
  value: z.string(),
});

const rankingRuleSchema = z.object({
  questionType: z.enum(["ranking"]),
  index: z.number(),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "equal",
    "notEqual",
    "beginsWith",
    "endsWith",
    "contains",
    "notContains",
  ]),
  value: z.string(),
});

const stringRuleSchema = z.object({
  questionType: z.enum([
    "phoneNumber",
    "shortText",
    "longText",
    "email",
    "dropdown",
    "website",
  ]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "equal",
    "notEqual",
    "beginsWith",
    "endsWith",
    "contains",
    "notContains",
  ]),
  value: z.string(),
});

const numberRuleSchema = z.object({
  questionType: z.enum(["number", "opinionScale", "rating"]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "equal",
    "notEqual",
    "lowerThan",
    "lowerEqualThan",
    "greaterThan",
    "greaterEqualThan",
  ]),
  value: z.number(),
});

const choiceRuleSchema = z.object({
  questionType: z.enum(["multipleChoice", "legal", "yesNo"]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum(["is", "isNot"]),
  value: z.union([z.boolean(), z.string()]),
});

const matrixRuleSchema = z.object({
  questionType: z.enum(["matrix"]),
  key: z.string(),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum(["is", "isNot"]),
  value: z.union([z.boolean(), z.string()]),
});

const dateRuleSchema = z.object({
  questionType: z.enum(["date"]),
  action: z.literal("jump"),
  to: questionId,
  operation: z.enum([
    "on",
    "notOn",
    "earlierThan",
    "earlierThanOrOn",
    "laterThan",
    "laterThanOrOn",
  ]),
  value: z.string(),
});

export const ruleSchema = z.union([
  stringRuleSchema,
  numberRuleSchema,
  dateRuleSchema,
  choiceRuleSchema,
  contactInfoRuleSchema,
  addressRuleSchema,
  rankingRuleSchema,
  matrixRuleSchema,
]);

const andRule = z.object({
  operation: z.literal("and"),
  rules: z.array(ruleSchema).min(2),
});

export const rulesSchema = z.array(z.union([ruleSchema, andRule]));
export const logicSchema = z.record(rulesSchema);

export type Logic = z.infer<typeof logicSchema>;
export type Rules = z.infer<typeof rulesSchema>;
export type Rule = z.infer<typeof ruleSchema>;

export type AddressRule = z.infer<typeof addressRuleSchema>;
export type ContactInfoRule = z.infer<typeof contactInfoRuleSchema>;
export type RankingRule = z.infer<typeof rankingRuleSchema>;
export type StringRule = z.infer<typeof stringRuleSchema>;
export type NumberRule = z.infer<typeof numberRuleSchema>;
export type ChoiceRule = z.infer<typeof choiceRuleSchema>;
export type MatrixRule = z.infer<typeof matrixRuleSchema>;
export type DateRule = z.infer<typeof dateRuleSchema>;

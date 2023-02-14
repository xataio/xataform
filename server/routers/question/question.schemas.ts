import { z } from "zod";
import { UnionToTuple } from "../../../utils/types";

export const questionCommunProps = z.object({
  /**
   * 0-n index to define question ordering into a single form.
   */
  order: z.number(),
  /**
   * Title
   */
  title: z.string(),
  /**
   * Description
   */
  description: z.string().nullable(),
  /**
   * Image or Video to illustrate
   */
  illustration: z.string().nullable(),
});

const contactOptionSchema = z.union([
  z.object({ enabled: z.literal(true), required: z.boolean() }),
  z.object({
    enabled: z.literal(false),
  }),
]);

export const questionSchema = z.discriminatedUnion("type", [
  // Multiple Choice
  questionCommunProps.extend({
    type: z.literal("multipleChoice"),
    required: z.boolean().default(false),
    multipleSelection: z.boolean().default(false),
    randomize: z.boolean().default(false),
    otherOption: z.boolean().default(false),
    choices: z.array(z.string()).default([]),
  }),

  // Contact Info
  questionCommunProps.extend({
    type: z.literal("contactInfo"),
    firstName: contactOptionSchema.default({ enabled: true, required: false }),
    lastName: contactOptionSchema.default({ enabled: true, required: false }),
    phoneNumber: contactOptionSchema.default({
      enabled: true,
      required: false,
    }),
    email: contactOptionSchema.default({ enabled: true, required: false }),
    company: contactOptionSchema.default({ enabled: true, required: false }),
  }),

  // Address
  questionCommunProps.extend({
    type: z.literal("address"),
    addressRequired: z.boolean().default(false),
    address2Required: z.boolean().default(false),
    cityTownRequired: z.boolean().default(false),
    stateRegionProviceRequired: z.boolean().default(false),
    zipCodeRequired: z.boolean().default(false),
    countryRequired: z.boolean().default(false),
  }),

  // Phone Number
  questionCommunProps.extend({
    type: z.literal("phoneNumber"),
    required: z.boolean().default(false),
  }),

  // Short Text
  questionCommunProps.extend({
    type: z.literal("shortText"),
    required: z.boolean().default(false),
    maxLength: z.number().nullable().default(null),
  }),

  // Long Text
  questionCommunProps.extend({
    type: z.literal("longText"),
    required: z.boolean().default(false),
    maxLength: z.number().nullable().default(null),
  }),

  // Statement
  questionCommunProps.extend({
    type: z.literal("statement"),
    hasQuotationMarks: z.boolean().default(false),
    buttonText: z.string().max(24).default("Continue"),
  }),

  // Ranking
  questionCommunProps.extend({
    type: z.literal("ranking"),
    required: z.boolean().default(false),
    randomize: z.boolean().default(false),
    choices: z.array(z.string()).default([]),
  }),

  // Yes/No
  questionCommunProps.extend({
    type: z.literal("yesNo"),
    required: z.boolean().default(false),
  }),

  // Email
  questionCommunProps.extend({
    type: z.literal("email"),
    required: z.boolean().default(false),
  }),

  // Opinion Scale
  questionCommunProps.extend({
    type: z.literal("opinionScale"),
    required: z.boolean().default(false),
    min: z.number().min(0).max(1).int().default(1),
    max: z.number().min(5).max(10).int().default(5),
    labelMin: z.string().max(24).default(""),
    labelMed: z.string().max(24).default(""),
    labelMax: z.string().max(24).default(""),
  }),

  // Rating
  questionCommunProps.extend({
    type: z.literal("rating"),
    required: z.boolean().default(false),
    steps: z.number().min(1).max(10).int().default(1),
  }),

  // Matrix
  questionCommunProps.extend({
    type: z.literal("matrix"),
    required: z.boolean().default(false),
    multipleSelection: z.boolean().default(false),
    rows: z.array(z.string()).default([]),
    columns: z.array(z.string()).default([]),
  }),

  // Date
  questionCommunProps.extend({
    type: z.literal("date"),
    required: z.boolean().default(false),
    format: z
      .union([z.literal("MMDDYYYY"), z.literal("DDMMYY")])
      .default("DDMMYY"),
    separator: z
      .union([z.literal("/"), z.literal("-"), z.literal(".")])
      .default("/"),
  }),

  // Number
  questionCommunProps.extend({
    type: z.literal("number"),
    required: z.boolean().default(false),
    min: z.number().nullable().default(null),
    max: z.number().nullable().default(null),
  }),

  // Dropdown
  questionCommunProps.extend({
    type: z.literal("dropdown"),
    required: z.boolean().default(false),
    randomize: z.boolean().default(false),
    alphabeticalOrder: z.boolean().default(false),
    choices: z.array(z.string()).default([]),
  }),

  // Legal
  questionCommunProps.extend({
    type: z.literal("legal"),
    required: z.boolean().default(false),
  }),

  // Website
  questionCommunProps.extend({
    type: z.literal("website"),
    required: z.boolean().default(false),
  }),
]);

export type Question = z.infer<typeof questionSchema>;
export type QuestionCommunProps = z.infer<typeof questionCommunProps>;

export type QuestionType = Question["type"];

export const questionTypeSchema = z.enum(
  Array.from(questionSchema.optionsMap.keys()) as UnionToTuple<QuestionType>
);

export const questionTypes = Array.from(
  questionSchema.optionsMap.keys()
) as QuestionType[];

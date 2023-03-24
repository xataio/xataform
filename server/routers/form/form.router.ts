import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  questionCommunProps,
  questionSchema,
  QuestionType,
  questionTypeSchema,
} from "../question/question.schemas";
import { formSchema } from "./form.schemas";

export const formRouter = router({
  /**
   * List form
   */
  list: protectedProcedure.query(async ({ ctx: { user, db } }) => {
    return db.listForms({ userId: user.id });
  }),

  /**
   * Get a form
   */
  get: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx: { user, db }, input: { formId } }) => {
      const form = await db.getForm(formId).catch(() => null);

      if (form === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (form.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        id: formId,
        ...formSchema.parse(form),
      };
    }),

  /**
   * Create a new form
   */
  create: protectedProcedure
    .input(z.object({ form: formSchema, copyFrom: z.string().optional() }))
    .mutation(async ({ ctx: { user, db }, input: { form, copyFrom } }) => {
      const count = await db.getFormsCount({ userId: user.id });
      if (count >= 100) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Limit of 100 forms reached!",
        });
      }

      const createdForm = await db.createForm({
        ...form,
        userId: user.id,
      });

      if (copyFrom) {
        db.copyQuestions({
          fromFormId: copyFrom,
          toFormId: createdForm.id,
          userId: user.id,
        });
        const ending = await db.getEnding({ formId: copyFrom });
        db.createEnding({
          formId: createdForm.id,
          title: ending.title,
          subtitle: ending.subtitle || undefined,
          userId: user.id,
        });
      } else {
        db.createQuestion({
          formId: createdForm.id,
          type: "shortText",
          description: "",
          illustration: null,
          maxLength: null,
          order: 0,
          required: false,
          title: "My first question",
          userId: user.id,
        });

        db.createEnding({
          formId: createdForm.id,
          title: "Thanks for your time!",
          userId: user.id,
        });
      }

      return createdForm;
    }),

  rename: protectedProcedure
    .input(z.object({ formId: z.string(), title: z.string() }))
    .mutation(async ({ ctx: { user, db }, input: { formId, title } }) => {
      const form = await db.getForm(formId);

      if (form === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (form.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return await db.updateForm(formId, { title });
    }),

  delete: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .mutation(async ({ ctx: { user, db }, input: { formId } }) => {
      const form = await db.getForm(formId).catch(() => null);

      if (form === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (form.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.deleteForm(formId);

      return { formId, title: form.title, deleted: true };
    }),

  undoDelete: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .mutation(async ({ ctx: { user, db }, input: { formId } }) => {
      const form = await db
        .getForm(formId, { skipDeleteCheck: true })
        .catch(() => null);

      if (form === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (form.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.undoDeleteForm(formId);

      return { formId, deleted: false };
    }),

  /**
   * Retrieve all the common props questions of a form
   */
  summary: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx: { user, db }, input }) => {
      const questions = await db.listQuestions({
        formId: input.formId,
        userId: user.id,
      });

      if (isOrderCorrect(questions)) {
        return questions;
      } else {
        // remap the `order` to be correct
        return questions.map((i, index) => ({ ...i, order: index }));
      }
    }),

  /**
   * Add a new question in the form
   */
  addQuestion: protectedProcedure
    .input(z.object({ formId: z.string(), question: questionSchema }))
    .mutation(async ({ ctx: { user, db }, input: { formId, question } }) => {
      const userId = user.id;
      const count = await db.getQuestionsCount({ formId, userId });
      if (count >= 100) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Limit of 100 questions/form reached!",
        });
      }

      const createdQuestion = await db.createQuestion({
        formId,
        userId,
        ...question,
      });

      return { formId, createdQuestion };
    }),

  /**
   * Reorder questions
   */
  reorderQuestions: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        questions: z.array(
          questionCommunProps.extend({
            id: z.string(),
            type: questionTypeSchema,
          })
        ),
      })
    )
    .mutation(async ({ ctx: { db }, input: { questions, formId } }) => {
      await db.updateQuestions(questions);

      return { questions, formId };
    }),

  /**
   * Add one question of each type for debugging
   */
  addMockQuestions: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .mutation(async ({ ctx: { user, db }, input: { formId } }) => {
      const count = await db.getQuestionsCount({ formId, userId: user.id });

      await db.createQuestions(
        Array.from(questionSchema.optionsMap.keys()).map((i, index) => ({
          order: count + index,
          title: i as string,
          type: i as QuestionType,
          form: formId,
          userId: user.id,
        }))
      );

      return { formId };
    }),

  publish: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .mutation(async ({ ctx: { revalidate, db, user }, input: { formId } }) => {
      await db.publishForm({ formId, userId: user.id });

      revalidate(`/form/${formId}`);

      return {
        revalidate: true,
      };
    }),

  submitFormAnswer: publicProcedure
    .input(
      z.object({ formId: z.string(), version: z.number(), payload: z.any() })
    )
    .mutation(async ({ ctx: { db }, input: { formId, payload, version } }) => {
      await db.submitFormAnswers({ formId, version, payload });

      return {
        submitted: true,
      };
    }),
});

const isOrderCorrect = (questions: { order: number }[]) =>
  questions
    .map((i) => i.order)
    .sort()
    .reduce((isValid, i, index) => isValid && i === index, true);

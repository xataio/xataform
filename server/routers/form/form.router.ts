import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import { questionSchema } from "../question/question.schemas";
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
      const form = await db.getForm(formId);
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
    .input(formSchema)
    .mutation(async ({ ctx: { user, db }, input }) => {
      const count = await db.getFormsCount({ userId: user.id });
      if (count >= 100) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Limit of 100 forms reached!",
        });
      }
      const createdForm = await db.createForm({
        ...input,
        userId: user.id,
      });

      await db.createQuestion({
        formId: createdForm.id,
        type: "shortText",
        description: "",
        illustration: null,
        maxLength: null,
        order: 0,
        required: false,
        title: "",
        userId: user.id,
      });

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
      const form = await db.getForm(formId);

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
      const form = await db.getForm(formId, { skipDeleteCheck: true });

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
      if (question.order !== count) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `\`question.order\` is out of sync, should be ${count} instead of ${question.order}`,
        });
      }

      await db.createQuestion({ formId, userId, ...question });
    }),
});

const isOrderCorrect = (questions: { order: number }[]) =>
  questions
    .map((i) => i.order)
    .sort()
    .reduce((isValid, i, index) => isValid && i === index, true);

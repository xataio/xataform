import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import { Question, questionSchema } from "./question.schemas";

type QuestionWithId = Question & { id: string };

export const questionRouter = router({
  /**
   * Update one question
   */
  update: protectedProcedure
    .input(z.object({ id: z.string(), question: questionSchema }))
    .mutation(async ({ ctx: { db, user }, input }): Promise<QuestionWithId> => {
      // Retrieve previous question & check if everything is legit
      const prev = await db.getQuestion(input.id);
      if (!prev) throw new TRPCError({ code: "NOT_FOUND" });
      if (prev.userId !== user.id) throw new TRPCError({ code: "FORBIDDEN" });
      if (prev.order !== input.question.order)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Please use the specialized `question.reorder` method",
        });

      return await db.updateQuestion(input);
    }),

  /**
   * Get one question
   */
  get: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx: { db, user }, input }): Promise<QuestionWithId> => {
      const rawQuestion = await db.getQuestion(input.questionId);
      if (rawQuestion === null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const { userId, ...question } = rawQuestion;

      if (userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return question;
    }),

  /**
   * Delete one question
   */
  delete: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(
      async ({
        ctx: { db, user },
        input: { questionId },
      }): Promise<{ questionId: string; deleted: boolean }> => {
        const question = await db.getQuestion(questionId);

        if (question === null) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (question.userId !== user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        await db.deleteQuestion(questionId);

        return { questionId, deleted: true };
      }
    ),
});

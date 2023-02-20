import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import { Question, questionSchema } from "./question.schemas";
import { readFile } from "fs/promises";
import path from "path";

type QuestionWithId = Question & { id: string };

export const questionRouter = router({
  /**
   * Update one question
   */
  update: protectedProcedure
    .input(z.object({ questionId: z.string(), question: questionSchema }))
    .mutation(async ({ ctx: { db, user }, input }): Promise<QuestionWithId> => {
      // Retrieve previous question & check if everything is legit
      const prev = await db.getQuestion(input.questionId);
      if (!prev) throw new TRPCError({ code: "NOT_FOUND" });
      if (prev.userId !== user.id) throw new TRPCError({ code: "FORBIDDEN" });
      if (prev.order !== input.question.order)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Please use the specialized `question.reorder` method",
        });

      return await db.updateQuestion({
        id: input.questionId,
        question: input.question,
      });
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

      if (question.type === "multipleChoice") {
        if (question.limitMax) {
          question.limitMax = Math.max(0, question.limitMax);
          question.limitMax = Math.min(
            question.limitMax,
            question.choices.length
          );
        }
        if (question.limitMin) {
          question.limitMin = Math.max(0, question.limitMin);
          question.limitMin = Math.min(
            question.limitMin,
            question.limitMax ?? question.choices.length
          );
        }
      }

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

        const count = await db.getQuestionsCount({
          formId: question.formId,
          userId: question.userId,
        });

        if (count <= 1) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "You can't delete the last question",
          });
        }

        await db.deleteQuestion(questionId);

        return { questionId, deleted: true };
      }
    ),

  getXataUrl: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input: { questionId } }) => {
      const xataRcPath = path.join(process.cwd(), ".xatarc");
      const xataRcRaw = await readFile(xataRcPath, "utf-8");
      const { databaseURL } = z
        .object({ databaseURL: z.string() })
        .parse(JSON.parse(xataRcRaw));

      const { pathname, host } = new URL(databaseURL);

      const workspace = host.split(".")[0];
      const region = host.split(".")[1];
      const db = pathname.slice("/db/".length);
      const q = encodeURIComponent(
        JSON.stringify({
          filters: [
            {
              id: 0,
              field: "id",
              condition: "is",
              keyword: questionId,
              andOr: "and",
            },
          ],
          groups: [],
          sorts: [],
          hiddenColumns: [],
        })
      );

      return `https://app.xata.io/workspaces/${workspace}/dbs/${db}:${region}/branches/main/tables/question?q=${q}`;
    }),
});

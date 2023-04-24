import { protectedProcedure, publicProcedure, router } from "server/trpc";
import { z } from "zod";
import { rulesSchema } from "./logic.schemas";

export const logicRouter = router({
  upsert: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        questionId: z.string(),
        rules: rulesSchema,
      })
    )
    .mutation(async ({ ctx: { db }, input: { formId, questionId, rules } }) => {
      return db.upsertRules({
        questionId,
        rules,
      });
    }),

  getLogic: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .query(async ({ ctx: { db }, input: { formId } }) => {
      return await db.getLogic({ formId });
    }),
});

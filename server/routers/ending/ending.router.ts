import { protectedProcedure, router } from "server/trpc";
import { z } from "zod";

export const endingRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
      })
    )
    .query(async ({ ctx: { db }, input: { formId } }) => {
      const ending = await db.getEnding({ formId });

      return ending;
    }),

  update: protectedProcedure
    .input(
      z.object({
        endingId: z.string(),
        formId: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
      })
    )
    .mutation(
      async ({ ctx: { db }, input: { formId, endingId, title, subtitle } }) => {
        const ending = await db.updateEnding({ endingId, title, subtitle });

        if (ending === null) throw new Error("Ending not found");
        return {
          formId,
          endingId,
          title: ending.title,
          subtitle: ending.subtitle,
        };
      }
    ),
});

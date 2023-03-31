import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  status: z.enum(["draft", "live"]).catch("draft"),
  version: z.number(),
  responses: z.number(),
  unpublishedChanges: z.number().default(0),
});

export type Form = z.infer<typeof formSchema>;

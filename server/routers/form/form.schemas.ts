import { z } from "zod";

export const formSchema = z.object({
  title: z.string(),
  status: z.enum(["draft", "live", "finished"]).catch("draft"),
});

export type Form = z.infer<typeof formSchema>;

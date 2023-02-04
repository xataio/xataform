import { router } from "../trpc";
import { formRouter } from "./form/form.router";
import { questionRouter } from "./question/question.router";

export const appRouter = router({
  form: formRouter,
  question: questionRouter,
});

export type AppRouter = typeof appRouter;

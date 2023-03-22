import { router } from "../trpc";
import { endingRouter } from "./ending/ending.router";
import { formRouter } from "./form/form.router";
import { questionRouter } from "./question/question.router";

export const appRouter = router({
  form: formRouter,
  question: questionRouter,
  ending: endingRouter,
});

export type AppRouter = typeof appRouter;

import { router } from "../trpc";
import { endingRouter } from "./ending/ending.router";
import { formRouter } from "./form/form.router";
import { logicRouter } from "./logic/logic.router";
import { questionRouter } from "./question/question.router";

export const appRouter = router({
  form: formRouter,
  question: questionRouter,
  ending: endingRouter,
  logic: logicRouter,
});

export type AppRouter = typeof appRouter;

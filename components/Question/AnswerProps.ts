import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";

export type AnswerProps<T extends QuestionType> =
  | EditingAnswerProps<T>
  | SubmitAnswerProps<T>;

type CommonProps<T extends QuestionType> = QuestionOfType<T> & {
  layout: "split" | "full";
};

type EditingAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: true;
  onUpdate: (question: Partial<QuestionOfType<T>>) => void;
};

type SubmitAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: false;
  onSubmit: (answer: string) => void;
};

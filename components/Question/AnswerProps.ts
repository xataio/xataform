import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";

export type AnswerProps<T extends QuestionType> =
  | EditingAnswerProps<T>
  | SubmitAnswerProps<T>;

export type AnswerLayout = "split" | "full";

type CommonProps<T extends QuestionType> = QuestionOfType<T> & {
  layout: AnswerLayout;
  questionId: string;
  formId: string;
};

type EditingAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: true;
};

type SubmitAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: false;
  onSubmit: (answer: string) => void;
};

import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";

export type AnswerProps<T extends QuestionType> =
  | EditingAnswerProps<T>
  | SubmitAnswerProps<T>;

type CommonProps<T extends QuestionType> = {
  type: T;
  layout: "split" | "full";
};

type EditingAnswerProps<T extends QuestionType> = CommonProps<T> & {
  editable: true;
  onUpdate: (question: QuestionOfType<T>) => void;
};

type SubmitAnswerProps<T extends QuestionType> = CommonProps<T> & {
  editable: false;
  onSubmit: (answer: string) => void;
};

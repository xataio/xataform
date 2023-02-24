import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";

export type SettingsProps<T extends QuestionType> = QuestionOfType<T> & {
  questionId: string;
  formId: string;
};

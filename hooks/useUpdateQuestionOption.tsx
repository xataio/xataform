import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";
import { useUpdateQuestion } from "./useUpdateQuestion";

export function useUpdateQuestionOption<
  Type extends QuestionType,
  Question extends QuestionOfType<Type> = QuestionOfType<Type>,
  Key extends keyof Question = keyof Question
>({
  formId,
  questionId,
  question,
}: {
  formId: string;
  questionId: string;
  question: Question;
}) {
  const { updateQuestion } = useUpdateQuestion({ formId });

  return (key: Key) => (value: Question[Key]) =>
    updateQuestion({
      questionId,
      question: {
        ...question,
        [key]: value,
      },
    });
}

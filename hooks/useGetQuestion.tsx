import { trpc } from "utils/trpc";

export function useGetQuestion({
  questionId,
}: {
  questionId: string;
  formId: string;
}) {
  const { data: question, ...rest } = trpc.question.get.useQuery({
    questionId,
  });

  return {
    question,
    ...rest,
  };
}

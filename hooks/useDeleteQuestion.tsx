import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useDeleteQuestion({ formId }: { formId: string }) {
  const utils = trpc.useContext();
  const { mutate: deleteQuestion } = trpc.question.delete.useMutation({
    async onMutate(updatedQuestion) {
      await utils.question.get.cancel({
        questionId: updatedQuestion.questionId,
      });
      await utils.form.summary.cancel({ formId });

      const previousQuestion = utils.question.get.getData({
        questionId: updatedQuestion.questionId,
      });
      const previousSummary = utils.form.summary.getData({ formId });

      utils.question.get.setData(
        { questionId: updatedQuestion.questionId },
        undefined
      );

      utils.form.summary.setData({ formId }, (prev) =>
        prev
          ? prev
              .filter((i) => i.id !== updatedQuestion.questionId)
              .map((i, order) => ({ ...i, order }))
          : []
      );

      return {
        previousSummary,
        previousQuestion,
      };
    },
    onError(err, updatedQuestion, context) {
      utils.form.summary.setData({ formId }, context?.previousSummary);
      utils.question.get.setData(
        { questionId: updatedQuestion.questionId },
        context?.previousQuestion
      );
      toast.error(err.message);
    },
    onSettled(question) {
      utils.form.summary.invalidate({ formId });
      utils.question.get.invalidate(
        question ? { questionId: question.questionId } : undefined
      );
    },
  });

  return {
    deleteQuestion,
  };
}

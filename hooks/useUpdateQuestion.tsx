import { toast } from "react-toastify";
import { questionSchema } from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";

export function useUpdateQuestion({ formId }: { formId: string }) {
  const utils = trpc.useContext();
  const { mutate: updateQuestion } = trpc.question.update.useMutation({
    async onMutate(updatedQuestion) {
      await utils.question.get.cancel({
        questionId: updatedQuestion.questionId,
      });
      await utils.form.summary.cancel({ formId });
      await utils.form.get.cancel({ formId });

      const previousQuestion = utils.question.get.getData({
        questionId: updatedQuestion.questionId,
      });
      const previousSummary = utils.form.summary.getData({ formId });

      utils.question.get.setData(
        { questionId: updatedQuestion.questionId },
        () => ({
          id: updatedQuestion.questionId,
          ...questionSchema.parse(updatedQuestion.question),
        })
      );

      utils.form.summary.setData({ formId }, (prev) =>
        prev
          ? prev.map((i) =>
              i.id === updatedQuestion.questionId
                ? {
                    id: updatedQuestion.questionId,
                    ...questionSchema.parse(updatedQuestion.question),
                  }
                : i
            )
          : []
      );

      utils.form.get.setData({ formId }, (prev) =>
        prev
          ? { ...prev, unpublishedChanges: prev.unpublishedChanges + 1 }
          : undefined
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
        question ? { questionId: question.id } : undefined
      );
    },
  });

  return {
    updateQuestion,
  };
}

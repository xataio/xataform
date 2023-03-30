import { toast } from "react-toastify";
import { Question } from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";

export function useDeleteQuestion({ formId }: { formId: string }) {
  const utils = trpc.useContext();
  const { mutate: deleteQuestion } = trpc.question.delete.useMutation({
    async onMutate(updatedQuestion) {
      await utils.question.get.cancel({
        questionId: updatedQuestion.questionId,
      });
      await utils.form.summary.cancel({ formId });

      const previousSummary = utils.form.summary.getData({ formId });
      const previousQuestions = (previousSummary || []).map((i) =>
        utils.question.get.getData({
          questionId: i.id,
        })
      );

      previousQuestions
        .filter((q): q is Question & { id: string } =>
          Boolean(q && q.id !== updatedQuestion.questionId)
        )
        .forEach((q, order) => {
          console.log(q, order);
          utils.question.get.setData({ questionId: q.id }, { ...q, order });
        });

      utils.form.summary.setData({ formId }, (prev) =>
        prev
          ? prev
              .filter((i) => i.id !== updatedQuestion.questionId)
              .map((i, order) => ({ ...i, order }))
          : []
      );

      return {
        previousSummary,
        previousQuestions,
      };
    },
    onError(err, _, context) {
      utils.form.summary.setData({ formId }, context?.previousSummary);
      context?.previousQuestions.forEach((q) => {
        if (q) utils.question.get.setData({ questionId: q.id }, q);
      });
      toast.error(err.message);
    },
    onSettled() {
      utils.form.summary.invalidate({ formId });
      utils.question.get.invalidate(undefined);
    },
  });

  return {
    deleteQuestion,
  };
}

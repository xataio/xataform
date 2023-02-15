import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useReorderQuestions() {
  const utils = trpc.useContext();

  const { mutate: reorderQuestions } = trpc.form.reorderQuestions.useMutation({
    async onMutate({ questions: reorderedQuestions, formId }) {
      utils.form.summary.setData(
        { formId },
        reorderedQuestions.map((i, order) => ({ ...i, order }))
      );
      reorderedQuestions.forEach((q) =>
        utils.question.get.setData({ questionId: q.id }, (prev) =>
          prev ? { ...prev, order: q.order } : undefined
        )
      );
    },
    onError(err) {
      toast.error(err.message);
    },
    onSettled(res) {
      utils.form.summary.invalidate(res ? { formId: res.formId } : undefined);
      res?.questions.forEach(({ id }) =>
        utils.question.get.invalidate({ questionId: id })
      );
    },
  });

  return {
    reorderQuestions,
  };
}

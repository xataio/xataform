import { toast } from "react-toastify";
import { RouterOutputs, trpc } from "utils/trpc";

export function useAddQuestion() {
  const utils = trpc.useContext();

  const { mutateAsync: addQuestion } = trpc.form.addQuestion.useMutation({
    async onMutate(newQuestion) {
      await utils.form.summary.cancel();
      const previousQuestions = utils.form.summary.getData({
        formId: newQuestion.formId,
      });
      const optimisticQuestion: RouterOutputs["form"]["summary"][-1] = {
        id: "optimistic_" + self.crypto.randomUUID(),
        ...newQuestion.question,
      };

      utils.form.summary.setData({ formId: newQuestion.formId }, (prev) =>
        prev ? [...prev, optimisticQuestion] : [optimisticQuestion]
      );

      return {
        previousQuestions,
      };
    },
    onError(err, newQuestion, context) {
      utils.form.summary.setData(
        { formId: newQuestion.formId },
        context?.previousQuestions
      );
      toast.error(err.message);
    },
    async onSettled(res) {
      await utils.form.summary.invalidate(
        res ? { formId: res.formId } : undefined
      );
    },
  });

  return {
    addQuestion,
  };
}

import { toast } from "react-toastify";
import { questionSchema } from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";

export function useUpdateQuestion({ formId }: { formId: string }) {
  const utils = trpc.useContext();
  const { mutate: updateQuestion } = trpc.question.update.useMutation({
    async onMutate(updatedQuestion) {
      console.log("on mutate", updatedQuestion, formId);
      await utils.question.get.cancel({ questionId: updatedQuestion.id });
      await utils.form.summary.cancel({ formId });

      const previousQuestion = utils.question.get.getData({
        questionId: updatedQuestion.id,
      });
      const previousSummary = utils.form.summary.getData({ formId });

      utils.question.get.setData({ questionId: updatedQuestion.id }, () => ({
        id: updatedQuestion.id,
        ...questionSchema.parse(updatedQuestion.question),
      }));

      utils.form.summary.setData({ formId }, (prev) =>
        prev
          ? prev.map((i) =>
              i.id === updatedQuestion.id
                ? {
                    id: updatedQuestion.id,
                    ...questionSchema.parse(updatedQuestion.question),
                  }
                : i
            )
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
        { questionId: updatedQuestion.id },
        context?.previousQuestion
      );
      toast.error(err.message);
    },
    onSettled(question) {
      console.log("invalidate", { formId, question });
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

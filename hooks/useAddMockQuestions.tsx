import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useAddMockQuestions() {
  const utils = trpc.useContext();

  const { mutate: addMockQuestions, isLoading: isAddingMockQuestions } =
    trpc.form.addMockQuestions.useMutation({
      onError(err) {
        toast.error(err.message);
      },
      onSettled(res) {
        utils.form.summary.invalidate(res ? { formId: res.formId } : undefined);
      },
    });

  return {
    addMockQuestions,
    isAddingMockQuestions,
  };
}

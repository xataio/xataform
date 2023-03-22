import { toast } from "react-toastify";
import { RouterOutputs, trpc } from "utils/trpc";

export function useCreateForm() {
  const utils = trpc.useContext();

  const { mutate: createForm, isLoading: isFormCreating } =
    trpc.form.create.useMutation({
      async onMutate(newForm) {
        await utils.form.list.cancel();
        const previousForms = utils.form.list.getData();
        const optimisticForm: RouterOutputs["form"]["list"][-1] = {
          title: newForm.title,
          status: "draft",
          id: "optimistic_" + self.crypto.randomUUID(),
          version: 0,
        };

        utils.form.list.setData(undefined, (prev) =>
          prev ? [...prev, optimisticForm] : [optimisticForm]
        );

        return {
          previousForms,
        };
      },
      onError(err, _newForm, context) {
        utils.form.list.setData(undefined, context?.previousForms);
        toast.error(err.message);
      },
      onSettled() {
        utils.form.list.invalidate();
      },
    });

  return {
    createForm,
    isFormCreating,
  };
}

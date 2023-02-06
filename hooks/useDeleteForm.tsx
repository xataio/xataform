import { ToastDeletion } from "components/ToastDeletion";
import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useDeleteForm() {
  const utils = trpc.useContext();

  const { mutate: undoDeleteForm } = trpc.form.undoDelete.useMutation({
    onSettled() {
      utils.form.list.invalidate();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const { mutate: deleteForm } = trpc.form.delete.useMutation({
    async onMutate(deletedForm) {
      await utils.form.list.cancel();
      const previousForms = utils.form.list.getData();
      const prev = previousForms?.find((i) => i.id === deletedForm.formId);
      utils.form.list.setData(undefined, (forms) =>
        forms?.filter((i) => i.id !== deletedForm.formId)
      );

      if (prev) {
        toast.success(
          <ToastDeletion
            title={prev.title}
            onUndo={() => undoDeleteForm({ formId: prev.id })}
          />
        );
      }

      return {
        previousForms,
      };
    },
    onError(err, _deletedForm, context) {
      utils.form.list.setData(undefined, context?.previousForms);
      toast.error(err.message);
    },
    onSettled() {
      utils.form.list.invalidate();
    },
  });

  return {
    deleteForm,
  };
}

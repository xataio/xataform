import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useRenameForm() {
  const utils = trpc.useContext();
  const { mutate: renameForm } = trpc.form.rename.useMutation({
    async onMutate(updatedForm) {
      await utils.form.list.cancel();
      await utils.form.get.cancel({ formId: updatedForm.formId });

      const previousForms = utils.form.list.getData();
      utils.form.list.setData(undefined, (prev) =>
        prev?.map((i) =>
          i.id === updatedForm.formId ? { ...i, title: updatedForm.title } : i
        )
      );

      const previousForm = utils.form.get.getData({
        formId: updatedForm.formId,
      });
      utils.form.get.setData({ formId: updatedForm.formId }, (prev) =>
        prev
          ? {
              ...prev,
              title: updatedForm.title,
            }
          : undefined
      );

      return {
        previousForms,
        previousForm,
      };
    },

    onError(err, updatedForm, context) {
      utils.form.list.setData(undefined, context?.previousForms);
      utils.form.get.setData(
        { formId: updatedForm.formId },
        context?.previousForm
      );
      toast.error(err.message);
    },

    onSettled(form) {
      utils.form.list.invalidate();
      utils.form.get.invalidate(form ? { formId: form.id } : undefined);
    },
  });

  return { renameForm };
}

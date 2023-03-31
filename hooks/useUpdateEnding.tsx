import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function useUpdateEnding() {
  const utils = trpc.useContext();
  const { mutate: updateEnding } = trpc.ending.update.useMutation({
    async onMutate(updatedEnding) {
      await utils.ending.get.cancel({ formId: updatedEnding.formId });
      await utils.form.get.cancel({ formId: updatedEnding.formId });

      const previousEnding = utils.ending.get.getData({
        formId: updatedEnding.formId,
      });

      utils.ending.get.setData(
        { formId: updatedEnding.formId },
        {
          id: updatedEnding.endingId,
          subtitle: updatedEnding.subtitle || null,
          title: updatedEnding.title,
        }
      );
      utils.form.get.setData({ formId: updatedEnding.formId }, (prev) =>
        prev
          ? { ...prev, unpublishedChanges: prev.unpublishedChanges + 1 }
          : undefined
      );

      return { previousEnding };
    },

    onError(err, updatedEnding, context) {
      utils.ending.get.setData(
        { formId: updatedEnding.formId },
        context?.previousEnding
      );
      toast.error(err.message);
    },

    onSettled(ending) {
      utils.ending.get.invalidate(
        ending ? { formId: ending.formId } : undefined
      );
    },
  });

  return { updateEnding };
}

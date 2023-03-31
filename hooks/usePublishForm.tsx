import { toast } from "react-toastify";
import { trpc } from "utils/trpc";

export function usePublishForm() {
  const utils = trpc.useContext();

  const { mutate: publishForm, isLoading: isFormPublishing } =
    trpc.form.publish.useMutation({
      async onMutate({ formId }) {
        await utils.form.get.cancel();
        utils.form.get.setData({ formId }, (prev) =>
          prev ? { ...prev, unpublishedChanges: 0 } : undefined
        );

        return { formId };
      },
      onError(err, _publishedForm) {
        toast.error(err.message);
      },
      onSettled(_, __, context) {
        utils.form.get.invalidate(context ?? undefined);
      },
    });

  return {
    publishForm,
    isFormPublishing,
  };
}

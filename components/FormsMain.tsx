import { useState } from "react";
import { RouterOutputs, trpc } from "../utils/trpc";
import { Button } from "./Button";
import { CreateOrRenameFormModal } from "./CreateOrRenameFormModal";
import { FormCard } from "./FormCard";
import { Spinner } from "./Spinner";
import { WelcomeForms } from "./WelcomeForms";
import { toast } from "react-toastify";
import { ToastDeletion } from "./ToastDeletion";

export function FormsMain() {
  const utils = trpc.useContext();

  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = trpc.form.list.useQuery();

  const { mutate: createForm, isLoading: isFormCreating } =
    trpc.form.create.useMutation({
      async onMutate(newForm) {
        await utils.form.list.cancel();
        const previousForms = utils.form.list.getData();
        const optimisticForm: RouterOutputs["form"]["list"][-1] = {
          title: newForm.title,
          status: newForm.status ?? "draft",
          id: "optimistic_" + self.crypto.randomUUID(),
        };

        utils.form.list.setData(undefined, (prev) =>
          prev ? [...prev, optimisticForm] : [optimisticForm]
        );

        return {
          previousForms,
        };
      },
      onError(_err, _newForm, context) {
        utils.form.list.setData(undefined, context?.previousForms);
      },
      onSettled() {
        utils.form.list.invalidate();
      },
    });

  const { mutate: renameForm } = trpc.form.rename.useMutation({
    async onMutate(updatedForm) {
      await utils.form.list.cancel();
      const previousForms = utils.form.list.getData();
      utils.form.list.setData(undefined, (prev) =>
        prev?.map((i) =>
          i.id === updatedForm.formId ? { ...i, title: updatedForm.title } : i
        )
      );

      return {
        previousForms,
      };
    },
    onError(_err, _updatedForm, context) {
      utils.form.list.setData(undefined, context?.previousForms);
    },
    onSettled() {
      utils.form.list.invalidate();
    },
  });

  const { mutate: undoDeleteForm } = trpc.form.undoDelete.useMutation({
    onSettled() {
      utils.form.list.invalidate();
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
    onError(_err, _deletedForm, context) {
      utils.form.list.setData(undefined, context?.previousForms);
    },
    onSettled() {
      utils.form.list.invalidate();
    },
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "rename"; formId: string; prevTitle: string }
  >(null);

  return (
    <>
      <CreateOrRenameFormModal
        isOpen={modal?.type === "create" || modal?.type === "rename"}
        prevTitle={modal?.type === "rename" ? modal.prevTitle : undefined}
        onClose={() => setModal(null)}
        isLoading={isFormCreating}
        onSubmit={async (title) => {
          if (modal?.type === "create") {
            await createForm({
              title,
              status: "draft",
            });
          }
          if (modal?.type === "rename") {
            await renameForm({
              title,
              formId: modal.formId,
            });
          }
          setModal(null);
        }}
      />
      <header className="flex items-center justify-between border-b border-b-slate-200 px-4 py-2 shadow">
        <h1 className="text-lg">My forms</h1>
        <Button icon="add" onClick={() => setModal({ type: "create" })}>
          Create xataform
        </Button>
      </header>
      <main className="flex-auto overflow-y-auto bg-slate-50 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded">
        <div className="h-full p-4">
          {isFormsLoading ? <Spinner /> : null}
          {formsError ? formsError.message : null}
          {forms?.length === 0 ? (
            <WelcomeForms onCreateClick={() => setModal({ type: "create" })} />
          ) : null}
          <div className="flex shrink-0 flex-row flex-wrap gap-4 pb-4">
            {forms?.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onRename={() => {
                  setModal({
                    type: "rename",
                    formId: form.id,
                    prevTitle: form.title,
                  });
                }}
                onDelete={() => deleteForm({ formId: form.id })}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

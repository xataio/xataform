import { useState } from "react";
import { trpc } from "utils/trpc";

import { Button } from "components/Button";
import { Spinner } from "components/Spinner";
import { useRenameForm } from "hooks/useRenameForm";
import { useCreateForm } from "hooks/useCreateForm";
import { useDeleteForm } from "hooks/useDeleteForm";

import { WelcomeForms } from "./WelcomeForms";
import { CreateOrRenameFormModal } from "./CreateOrRenameFormModal";
import { FormCard } from "./FormCard";
import clsx from "clsx";

export function FormsMain() {
  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = trpc.form.list.useQuery();

  const { createForm, isFormCreating } = useCreateForm();
  const { renameForm } = useRenameForm();
  const { deleteForm } = useDeleteForm();

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "rename"; formId: string; prevTitle: string }
    | { type: "duplicate"; formId: string; prevTitle: string }
  >(null);

  return (
    <>
      <CreateOrRenameFormModal
        isOpen={modal !== null}
        type={modal?.type}
        prevTitle={
          modal?.type === "rename" || modal?.type === "duplicate"
            ? modal.prevTitle
            : undefined
        }
        onClose={() => setModal(null)}
        isLoading={isFormCreating}
        onSubmit={async (title) => {
          if (modal?.type === "duplicate") {
            await createForm({
              form: { title, status: "draft", version: 0, responses: 0 },
              copyFrom: modal.formId,
            });
          }
          if (modal?.type === "create") {
            await createForm({
              form: { title, status: "draft", version: 0, responses: 0 },
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
      <main
        className={clsx(
          "flex-auto overflow-y-auto bg-slate-50",
          "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded"
        )}
      >
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
                onDuplicate={() =>
                  setModal({
                    type: "duplicate",
                    formId: form.id,
                    prevTitle: form.title,
                  })
                }
                onRename={() =>
                  setModal({
                    type: "rename",
                    formId: form.id,
                    prevTitle: form.title,
                  })
                }
                onDelete={() => deleteForm({ formId: form.id })}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

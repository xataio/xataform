import clsx from "clsx";
import { Button } from "components/Button";
import { Header } from "components/Header";
import { usePublishForm } from "hooks/usePublishForm";
import { useRenameForm } from "hooks/useRenameForm";
import Link from "next/link";
import { Form } from "server/routers/form/form.schemas";
import { InlineEditTitle } from "./InlineEditTitle";
import { StatusButton } from "./StatusButton";

export type FormHeaderProps = {
  form: Form & { id: string };
  page: "create" | "results";
};
export function FormHeader({ form, page }: FormHeaderProps) {
  const { renameForm } = useRenameForm();
  const { publishForm, isFormPublishing } = usePublishForm();

  return (
    <Header>
      <InlineEditTitle
        title={form.title}
        onSubmit={(nextTitle) =>
          renameForm({
            formId: form.id,
            title: nextTitle,
          })
        }
      />
      <div className="flex justify-center gap-2">
        <Link
          href={{
            pathname: "/form/[formId]/create",
            query: {
              formId: form.id,
            },
          }}
          className={clsx(
            "inline-flex items-center border-b-4 px-2 pt-3 text-base font-medium",
            page === "create"
              ? "border-indigo-300 text-white focus:bg-indigo-500 focus:outline-none"
              : "border-transparent text-indigo-300 hover:border-indigo-500 hover:text-indigo-200"
          )}
        >
          Create
        </Link>
        <Link
          href={{
            pathname: "/form/[formId]/results",
            query: {
              formId: form.id,
            },
          }}
          className={clsx(
            "inline-flex items-center border-b-4 px-2 pt-3 text-base font-medium",
            page === "results"
              ? "border-indigo-300 text-white focus:bg-indigo-500 focus:outline-none"
              : "border-transparent text-indigo-300 hover:border-indigo-500 hover:text-indigo-200"
          )}
        >
          Results
        </Link>
      </div>
      <>
        <Link
          href={{
            pathname: "/form/[formId]/preview",
            query: {
              formId: form.id,
            },
          }}
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Button icon="preview" variant="ghost" tabIndex={-1}>
            Preview
          </Button>
        </Link>
        <Button
          disabled={form.unpublishedChanges === 0}
          variant="ghost"
          onClick={() => publishForm({ formId: form.id })}
        >
          {isFormPublishing ? "Publishing…" : "Publish"}
        </Button>
        <StatusButton
          status={form.status}
          unpublishedChanges={form.unpublishedChanges}
        />
      </>
    </Header>
  );
}

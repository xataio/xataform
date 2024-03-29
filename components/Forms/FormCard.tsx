import { Spinner } from "components/Spinner";
import Link from "next/link";
import { RouterOutputs } from "../../utils/trpc";
import { Menu } from "../Menu";

export type FormCardProps = {
  form: RouterOutputs["form"]["list"][-1];
  onRename: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPublicUrlCopy: () => void;
} & React.PropsWithChildren;

export function FormCard({
  form,
  onRename,
  onDelete,
  onDuplicate,
  onPublicUrlCopy,
  ...props
}: FormCardProps) {
  return (
    <div
      {...props}
      className="relative w-40 rounded bg-white shadow transition-all duration-150  hover:scale-105 hover:cursor-pointer hover:shadow-md"
    >
      <Link
        href={{
          pathname: "/form/[formId]/create",
          query: {
            formId: form.id,
          },
        }}
        className="flex h-32 items-center justify-center border-b border-b-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <h1
          className="m-4 max-h-full overflow-hidden text-ellipsis"
          title={form.title}
        >
          {form.title}
        </h1>
      </Link>
      <div className="flex justify-between p-4">
        <p className="text-sm text-slate-400">
          {form.responses === 0 && "No responses"}
          {form.responses === 1 && "1 response"}
          {form.responses > 1 && `${form.responses} responses`}
        </p>
        <Menu
          items={[
            {
              title: "Edit",
              href: {
                pathname: "/form/[formId]/create",
                query: {
                  formId: form.id,
                },
              },
            },
            {
              title: "View responses",
              href: {
                pathname: "/form/[formId]/results",
                query: {
                  formId: form.id,
                },
              },
            },
            "---",
            {
              title: "Copy public url",
              onClick: onPublicUrlCopy,
            },
            "---",
            {
              title: "Rename",
              onClick: onRename,
            },
            {
              title: "Duplicate",
              onClick: onDuplicate,
            },
            "---",
            {
              title: "Delete",
              className: "text-red-600",
              onClick: onDelete,
            },
          ]}
        />
      </div>
      {form.id.startsWith("optimistic") ? (
        <div className="absolute inset-0 flex cursor-progress items-center justify-center overflow-hidden rounded">
          <div className="absolute h-full w-full bg-slate-500 opacity-20" />
          <Spinner />
        </div>
      ) : null}
    </div>
  );
}

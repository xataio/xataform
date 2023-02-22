import { Button } from "components/Button";
import { useDeleteQuestion } from "hooks/useDeleteQuestion";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";

export type SettingsProps = {
  formId: string;
  questionId: string;
};
export function Settings({ formId, questionId }: SettingsProps) {
  const { data: xataUrl } = trpc.question.getXataUrl.useQuery({ questionId });
  const { data } = trpc.question.get.useQuery({ questionId });
  const { data: questions } = trpc.form.summary.useQuery({ formId });
  const { deleteQuestion } = useDeleteQuestion({ formId });
  const { updateQuestion } = useUpdateQuestion({ formId });

  const hasIllustration = Boolean(data?.illustration);

  const [areYouSure, setAreYouSure] = useState(false);
  useEffect(() => {
    const timerId = setTimeout(() => setAreYouSure(false), 2000);
    return () => clearTimeout(timerId);
  }, [areYouSure]);

  return (
    <div className="p-4">
      <h1>Settings</h1>
      <div className="mt-4 flex flex-col items-start gap-2">
        <Button
          disabled={!questions || questions.length <= 1}
          icon={areYouSure ? "warning" : "trash"}
          variant={areYouSure ? "warning" : undefined}
          onClick={() => {
            if (areYouSure) {
              deleteQuestion({ questionId });
              setAreYouSure(false);
            } else {
              setAreYouSure(true);
            }
          }}
        >
          {areYouSure ? "Click to confirm" : "Delete question"}
        </Button>
        <Button
          icon="photo"
          isLoading={!data}
          onClick={() => {
            if (!data) return;
            updateQuestion({
              questionId,
              question: {
                ...data,
                illustration: hasIllustration
                  ? ""
                  : "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80",
              },
            });
          }}
        >
          {hasIllustration ? "Remove illustration" : "Add illustation"}
        </Button>
      </div>
      <h2 className="mt-4 mb-2 w-full border-b border-b-slate-400">Inspect</h2>
      <ul className="flex flex-col gap-2">
        {data &&
          Object.entries(data).map(([key, value]) => (
            <li key={`${data.id}-${key}`} className="flex gap-2 text-sm">
              <label className="font-medium text-indigo-800">{key}</label>
              <input type="text" defaultValue={JSON.stringify(value)} />
            </li>
          ))}
      </ul>
      <a
        target="_blank"
        rel="noreferrer"
        className="text-indigo-500 underline"
        href={xataUrl ?? ""}
      >
        Open in xata
      </a>
    </div>
  );
}

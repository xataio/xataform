import { Button } from "components/Button";
import { useGetQuestion } from "hooks/useGetQuestion";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import { questionSchema } from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";
import { DeleteQuestionButton } from "./DeleteQuestionButton";
import { QuestionSettings } from "./QuestionSettings";
import { QuestionTypeDropdown } from "./QuestionTypeDropdown";

export type SettingsProps = {
  formId: string;
  questionId: string;
};

export function Settings({ formId, questionId }: SettingsProps) {
  const { data: xataUrl } = trpc.question.getXataUrl.useQuery({ questionId });
  const { question } = useGetQuestion({ questionId, formId });
  const { data: questions } = trpc.form.summary.useQuery({ formId });
  const { updateQuestion } = useUpdateQuestion({ formId });

  const hasIllustration = Boolean(question?.illustration);

  return (
    <div className="p-4">
      <h2 className="font-medium">Type</h2>
      <QuestionTypeDropdown
        value={question?.type ?? "address"}
        onChange={(type) => {
          const questionWithDefaults = questionSchema.parse({
            ...question,
            type,
          });
          updateQuestion({
            questionId,
            question: questionWithDefaults,
          });
        }}
      />
      <h1 className="mt-4 font-medium">Settings</h1>
      <div className="mt-1 flex flex-col items-start gap-2">
        {question && (
          <QuestionSettings
            {...question}
            formId={formId}
            questionId={questionId}
          />
        )}
        <h1 className="mt-4 font-medium">Admin</h1>
        <DeleteQuestionButton
          formId={formId}
          questionId={questionId}
          disabled={!questions || questions.length <= 1}
        />
        <Button
          icon="photo"
          isLoading={!question}
          onClick={() => {
            if (!question) return;
            updateQuestion({
              questionId,
              question: {
                ...question,
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
      <h1 className="mt-4 font-medium">Debug</h1>
      <ul className="mt-1 flex flex-col gap-2">
        {question &&
          Object.entries(question).map(([key, value]) => (
            <li
              key={`${question.id}-${key}-${value}`}
              className="flex gap-2 text-sm"
            >
              <label className="font-medium text-indigo-800">{key}</label>
              <span>{JSON.stringify(value)}</span>
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

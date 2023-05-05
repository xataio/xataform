import { Button } from "components/Button";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { useFormSummary } from "hooks/useFormSummary";
import Image from "next/image";
import { useState } from "react";
import {
  AddressRule,
  ChoiceRule,
  ContactInfoRule,
  NumberRule,
  RankingRule,
  Rules,
  DateRule,
  MatrixRule,
  StringRule,
  Logic,
  Rule,
} from "server/routers/logic/logic.schemas";
import { match } from "ts-pattern";
import { RouterOutputs } from "utils/trpc";
import { RuleInput } from "./RuleInput";

export type EditLogicPanelProps = {
  formId: string;
  question?: RouterOutputs["form"]["summary"][number];
};

export function EditLogicPanel({ question, formId }: EditLogicPanelProps) {
  const [draftLogic, setDraftLogic] = useState<Record<string, Rule | null>>({});
  const { questions } = useFormSummary({ formId });

  const currentDraft = draftLogic[question?.id ?? ""];

  if (!question) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Image src="/logic.svg" width={200} height={200} alt="Welcome" />
        <p>Click on a question to start editing logic</p>
      </div>
    );
  }

  return (
    <>
      <header className="flex justify-between p-2 text-sm font-medium">
        <h1 className="just flex items-center gap-2">
          Edit logic for
          <QuestionIcon type={question.type} order={question.order + 1} />
        </h1>
      </header>
      <div className="p-2">
        {currentDraft ? (
          <div className="relative mb-4 flex flex-col gap-2 rounded border bg-slate-200 p-2 text-slate-700">
            <div className="font-bold">If</div>
            <div className="flex gap-2 rounded border border-indigo-200 bg-slate-50 p-1">
              <QuestionIcon type={question.type} order={question.order + 1} />
              <h2 className="truncate">{question.title}</h2>
            </div>
            <RuleInput
              questionType={currentDraft.questionType}
              value={{
                value: currentDraft.value,
                operation: currentDraft.operation,
              }}
              onChange={({ value, operation }) =>
                // @ts-ignore
                setDraftLogic((prev) => ({
                  ...prev,
                  [question.id]: {
                    ...prev[question.id],
                    value,
                    operation,
                  },
                }))
              }
            />
            <div className="text-sm text-teal-800 underline">
              + Add condition
            </div>
            <div className="mt-4 font-bold">Then</div>
            <div>Go to</div>
            <div>{currentDraft.to || "Select…"}</div>
            <div className="mt-4 flex items-end justify-between">
              <button
                className="text-sm text-red-800 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500"
                onClick={() =>
                  setDraftLogic((prev) => ({ ...prev, [question.id]: null }))
                }
              >
                Delete this rule
              </button>
              <Button>Done</Button>
            </div>
          </div>
        ) : null}
        <Button
          icon="add"
          disabled={Boolean(draftLogic[question.id])}
          onClick={() => {
            setDraftLogic((prev) => {
              if (question.type === "statement") return prev;

              return {
                ...prev,
                [question.id]: match(question.type)
                  .with(
                    "address",
                    (): AddressRule => ({
                      action: "jump",
                      questionType: "address",
                      key: "address",
                      operation: "equal",
                      value: "",
                      to: "",
                    })
                  )
                  .with(
                    "contactInfo",
                    (): ContactInfoRule => ({
                      action: "jump",
                      questionType: "contactInfo",
                      key: "firstName",
                      operation: "equal",
                      value: "",
                      to: "",
                    })
                  )
                  .with(
                    "ranking",
                    (): RankingRule => ({
                      action: "jump",
                      index: 0,
                      questionType: "ranking",
                      operation: "equal",
                      value: "",
                      to: "",
                    })
                  )
                  .with(
                    "phoneNumber",
                    "shortText",
                    "longText",
                    "email",
                    "dropdown",
                    "website",
                    (questionType): StringRule => ({
                      action: "jump",
                      questionType,
                      operation: "equal",
                      to: "",
                      value: "",
                    })
                  )
                  .with(
                    "number",
                    "opinionScale",
                    "rating",
                    (questionType): NumberRule => ({
                      action: "jump",
                      questionType,
                      operation: "equal",
                      value: 0,
                      to: "",
                    })
                  )
                  .with(
                    "multipleChoice",
                    "legal",
                    "yesNo",
                    (questionType): ChoiceRule => ({
                      action: "jump",
                      questionType,
                      operation: "is",
                      value: "",
                      to: "",
                    })
                  )
                  .with(
                    "matrix",
                    (): MatrixRule => ({
                      questionType: "matrix",
                      action: "jump",
                      to: "",
                      key: "",
                      operation: "is",
                      value: "",
                    })
                  )
                  .with(
                    "date",
                    (): DateRule => ({
                      questionType: "date",
                      action: "jump",
                      to: "",
                      operation: "on",
                      value: "",
                    })
                  )
                  .exhaustive(),
              };
            });
          }}
        >
          Add rule
        </Button>
      </div>
    </>
  );
}

import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import { useMemo, useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { EditChoicesDialog } from "./EditChoicesDialog";

function AnswerMultipleChoice({
  layout,
  choices,
  formId,
  questionId,
  isLastQuestion,
  onFocus,

  ...question
}: AnswerProps<"multipleChoice">) {
  const { updateQuestion } = useUpdateQuestion({ formId });

  const [answer, setAnswer] = useState<string[]>([]);
  const [isEditingChoices, setIsEditingChoices] = useState(false);

  const orderedChoices = useMemo(() => {
    if (question.randomize) {
      return choices.sort(() => Math.random() - 0.5);
    }
    return choices;
  }, [choices, question.randomize]);

  return (
    <AnswerWrapper
      layout={layout}
      isLastAnswer={isLastQuestion}
      onFocus={onFocus}
      onClick={question.admin ? () => setIsEditingChoices(true) : undefined}
      onSubmit={() => {
        if (question.admin) return;
        question.onSubmit(answer);
      }}
    >
      <EditChoicesDialog
        isOpen={isEditingChoices}
        onClose={() => setIsEditingChoices(false)}
        choices={choices}
        onSave={(nextChoices) => {
          setIsEditingChoices(false);
          updateQuestion({
            questionId,
            question: {
              ...question,
              type: "multipleChoice",
              choices: nextChoices,
            },
          });
        }}
      />
      <p aria-live="polite" className="mb-1 text-xs text-indigo-700">
        {getStatement(question.limitMin, question.limitMax, choices.length)}
      </p>
      {orderedChoices.length === 0 && question.admin ? (
        <div className="w-fit rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700">
          Click to add your choices
        </div>
      ) : null}
      <ul
        aria-label={question.title}
        role="group"
        className="flex flex-wrap gap-2"
      >
        {orderedChoices.map((choice) => {
          const checked = answer.includes(choice);
          return (
            <li
              key={choice}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onClick={() =>
                setAnswer((prev) =>
                  checked ? prev.filter((i) => i !== choice) : [...prev, choice]
                )
              }
              onKeyUp={(e) => {
                if (e.key === " " /* Space */) {
                  setAnswer((prev) =>
                    checked
                      ? prev.filter((i) => i !== choice)
                      : [...prev, choice]
                  );
                }
              }}
              className={clsx(
                "focus:outline-none focus:ring-2 hover:bg-indigo-200",
                "flex w-40 cursor-pointer flex-row items-center justify-between gap-2 rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700",
                checked && "bg-indigo-200 font-medium ring-1 ring-indigo-700"
              )}
            >
              <span>{choice}</span>
              {checked && <CheckIcon className="h-4 w-4" />}
            </li>
          );
        })}
      </ul>
    </AnswerWrapper>
  );
}

function getStatement(min = 0, max = 0, choicesLength: number) {
  if ((!min && !max) || (!min && max === choicesLength)) {
    return "Choose as many as you like";
  }
  if (!max && min) {
    return `Choose at least ${min}`;
  }
  if (min === max) {
    return `Choose ${min}`;
  }
  if (!min && max) {
    return `You can choose up to ${max}`;
  }

  return `Make beetwen ${min} and ${max} choices`;
}

export default AnswerMultipleChoice;

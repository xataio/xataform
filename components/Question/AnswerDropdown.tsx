import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import { Fragment, useMemo, useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { EditChoicesDialog } from "./EditChoicesDialog";

function AnswerDropdown({
  layout,
  choices,
  formId,
  questionId,
  isLastQuestion,
  onFocus,

  ...question
}: AnswerProps<"dropdown">) {
  const { updateQuestion } = useUpdateQuestion({ formId });

  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState("");
  const [query, setQuery] = useState("");
  const [isEditingChoices, setIsEditingChoices] = useState(false);

  const orderedChoices = useMemo(() => {
    if (question.alphabeticalOrder) {
      return choices.sort();
    }
    if (question.randomize) {
      return choices.sort(() => Math.random() - 0.5);
    }
    return choices;
  }, [choices, question.alphabeticalOrder, question.randomize]);

  let filteredChoices =
    query === ""
      ? orderedChoices
      : orderedChoices.filter((choice) =>
          choice.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <AnswerWrapper
      layout={layout}
      isLastAnswer={isLastQuestion}
      showRequired={showRequired}
      onFocus={onFocus}
      onClick={question.admin ? () => setIsEditingChoices(true) : undefined}
      onSubmit={() => {
        if (question.admin) return;
        if (question.required && answer === "") {
          setShowRequired(true);
          return;
        }
        question.onSubmit(answer);
      }}
      className="!overflow-visible"
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
              choices: nextChoices,
            },
          });
        }}
      />
      <Combobox
        value={answer}
        onChange={(value: string) => {
          setShowRequired(false);
          setAnswer(value);
        }}
        disabled={question.admin}
        as="div"
        className="relative block ui-open:z-10"
      >
        <div className="relative w-full">
          <Combobox.Input
            placeholder="Type or select an option"
            className="w-full border-0 border-b border-indigo-200 bg-transparent bg-white pl-2 pb-0.5 text-lg text-indigo-800 placeholder:text-indigo-200 focus:border-b-indigo-400 focus:outline-none"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-indigo-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          afterLeave={() => setQuery("")}
          as={Fragment}
        >
          <Combobox.Options
            className={clsx(
              "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
              "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            )}
          >
            {filteredChoices.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredChoices.map((choice) => (
                <Combobox.Option
                  key={choice}
                  value={choice}
                  className="relative cursor-default select-none py-2 pl-10 text-indigo-700 ui-active:bg-indigo-600 ui-active:text-white"
                >
                  {({ selected }) => (
                    <>
                      <span className={selected ? "font-medium" : undefined}>
                        {choice}
                      </span>
                      {selected ? (
                        <>
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
      {question.admin ? (
        <div className="-mt-2 self-end text-xs text-indigo-500">
          {choices.length === 0 && "No option in list"}
          {choices.length === 1 && "1 option in list"}
          {choices.length > 1 && `${choices.length} options in list`}
        </div>
      ) : null}
    </AnswerWrapper>
  );
}

export default AnswerDropdown;

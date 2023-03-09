import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { title } from "case";
import clsx from "clsx";
import { Fragment, useState } from "react";
import {
  QuestionType,
  questionTypes,
} from "server/routers/question/question.schemas";
import { QuestionIcon } from "./QuestionIcon";

export type QuestionTypeDropdownProps = {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
};

export function QuestionTypeDropdown({
  value,
  onChange,
}: QuestionTypeDropdownProps) {
  const [query, setQuery] = useState("");
  const filteredQuestionTypes = query
    ? questionTypes.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
    : questionTypes;

  return (
    <Combobox
      as="div"
      value={value}
      onChange={onChange}
      className="relative block w-full ui-open:z-10"
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded border border-indigo-200 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500 sm:text-sm">
          <QuestionIcon
            type={value}
            className="absolute inset-y-1.5 left-1.5 "
          />
          <Combobox.Input
            displayValue={title}
            className="w-full border-none py-2 pl-11 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-indigo-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition as={Fragment} afterLeave={() => setQuery("")}>
          <Combobox.Options
            className={clsx(
              "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
              "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            )}
          >
            {filteredQuestionTypes.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No question type found
              </div>
            ) : (
              filteredQuestionTypes.map((questionType) => (
                <Combobox.Option
                  key={questionType}
                  className="relative cursor-default select-none py-1 pl-10 text-slate-700 ui-active:bg-indigo-600 ui-active:text-white"
                  value={questionType}
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex gap-2 truncate ui-selected:font-medium `}
                      >
                        <QuestionIcon type={questionType} />
                        {title(questionType)}
                      </div>
                      {selected ? (
                        <span
                          className={`} absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

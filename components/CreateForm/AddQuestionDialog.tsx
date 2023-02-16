import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  QuestionType,
  questionTypes,
} from "server/routers/question/question.schemas";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { title } from "case";
import Image from "next/image";

export type AddQuestionDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  onAdd: (type: QuestionType) => void;
};

export function AddQuestionDialog({
  onAdd,
  isOpen,
  onClose,
}: AddQuestionDialogProps) {
  const [filter, setFilter] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredQuestionTypes = filter
    ? questionTypes.filter((i) =>
        i.toLowerCase().includes(filter.toLowerCase())
      )
    : questionTypes;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg border bg-white shadow-xl transition-all sm:my-8">
                {/* Search area */}
                <div className="flex flex-row items-center gap-4 border-b px-4 py-3">
                  <MagnifyingGlassIcon className="h-6 w-6 fill-indigo-600" />
                  <input
                    type="text"
                    placeholder="Find a question type"
                    className="w-full outline-none"
                    value={filter}
                    ref={searchRef}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>

                {/* Content */}
                <ul
                  className="grid grid-cols-4 grid-rows-5 p-4"
                  onKeyUp={(e) => {
                    if (e.key.length === 1) {
                      setFilter((prev) => prev + e.key);
                      searchRef.current?.focus();
                    }
                    if (e.key === "Backspace") {
                      setFilter((prev) => prev.slice(0, -1));
                      searchRef.current?.focus();
                    }
                  }}
                >
                  {filteredQuestionTypes.length === 0 && (
                    <li className="col-span-4 row-span-5 flex min-h-[200px] min-w-[800px] flex-col items-center justify-center gap-4">
                      <Image
                        src="/search.svg"
                        width={100}
                        height={100}
                        alt="Search"
                      />
                      <h3 className="text-md text-slate-600">
                        No question type found
                      </h3>
                    </li>
                  )}
                  {filteredQuestionTypes.map((questionType) => (
                    <li
                      key={questionType}
                      className="flex min-w-[200px] flex-row gap-4 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:bg-indigo-100 hover:bg-indigo-100"
                      role="button"
                      tabIndex={0}
                      onClick={() => onAdd(questionType)}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          onAdd(questionType);
                        }
                      }}
                    >
                      <QuestionIcon type={questionType} />
                      <div>{title(questionType)}</div>
                    </li>
                  ))}
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

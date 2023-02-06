import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Spinner } from "../Spinner";

export type CreateOrRenameFormModalProps = {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  onSubmit: (title: string) => void;
  isLoading: boolean;
  prevTitle?: string; // rename an existing title
};

export function CreateOrRenameFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  prevTitle = "",
}: CreateOrRenameFormModalProps) {
  const [title, setTitle] = useState(prevTitle);
  useEffect(() => setTitle(prevTitle), [prevTitle]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full  items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {prevTitle
                        ? "Rename this XataForm"
                        : "Start a new XataForm"}
                    </Dialog.Title>
                    {!prevTitle ? (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Give a title to your form to get started
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <form
                    className="relative"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (title.trim() !== "") {
                        onSubmit(title);
                        setTitle("");
                      }
                    }}
                  >
                    <input
                      id="title"
                      type="text"
                      placeholder="My form"
                      disabled={isLoading}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="inline-flex w-full justify-center rounded-md border-2 border-indigo-500 px-4 py-2 text-base shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                    />
                    {isLoading ? (
                      <div className="absolute top-1 right-1 scale-90">
                        <Spinner />
                      </div>
                    ) : null}
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import { Dialog, Transition } from "@headlessui/react";
import { Button } from "components/Button";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export type EditChoicesDialogProps = {
  onSave: (choices: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  choices: string[];
};

export function EditChoicesDialog({
  onSave,
  isOpen,
  onClose,
  choices,
}: EditChoicesDialogProps) {
  const actionsRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(choices.join("\n"));
  useEffect(() => {
    setValue(choices.join("\n"));
  }, [choices]);

  const hasChanged = value !== choices.join("\n");

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-800/30" aria-hidden="true" />
        </Transition.Child>

        {/* Dialog */}
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4  sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg border bg-white p-6 shadow-xl transition-all sm:my-8">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit choices
                </Dialog.Title>
                <Dialog.Description className="my-3 text-sm text-gray-500">
                  Write or paste your choices below. Each choice must be on
                  separate line.
                </Dialog.Description>
                <Editor
                  value={value}
                  onChange={(v) => setValue(v || "")}
                  onMount={(editor) => {
                    // Focus & set the cursor at the end
                    editor.focus();
                    editor.setPosition({
                      lineNumber: Infinity,
                      column: Infinity,
                    });

                    // Override tab behaviour
                    const TabKey = 2;
                    editor.addCommand(TabKey, () => {
                      if (!actionsRef.current) return;
                      const firstFocusableElement = Array.from(
                        actionsRef.current.children
                      ).find(isFocusableButton);

                      if (firstFocusableElement) {
                        firstFocusableElement.focus();
                      }
                    });
                  }}
                  options={{
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    scrollbar: {
                      verticalSliderSize: 8,
                    },
                    minimap: {
                      enabled: false,
                    },
                    overviewRulerLanes: 0,
                  }}
                  className="mb-2 h-52 rounded ring-1 ring-slate-400 ring-offset-1"
                />
                <div className="mt-2 flex flex-row gap-2" ref={actionsRef}>
                  <Button
                    disabled={!hasChanged}
                    onClick={() =>
                      onSave(
                        Array.from(
                          new Set(
                            value
                              .split("\n")
                              .map((i) => i.trim())
                              .filter((i) => i !== "")
                          )
                        )
                      )
                    }
                  >
                    Save choices
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setValue(choices.join("\n"));
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/**
 * Typeguard to filter focusable HTML Button element.
 */
const isFocusableButton = (element: Element): element is HTMLButtonElement => {
  return element instanceof HTMLButtonElement && element.disabled === false;
};

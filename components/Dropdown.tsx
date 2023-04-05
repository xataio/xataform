import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export type DropdownProps<T extends string | number> = {
  value: T;
  onChange: (value: T) => void;
  choices: T[];
  label: string;
};

export function Dropdown<T extends string | number>({
  value,
  onChange,
  choices,
  label,
}: DropdownProps<T>) {
  return (
    <Listbox
      value={value}
      onChange={onChange}
      className="flex w-full items-center gap-1 ui-open:z-10 "
      as="div"
    >
      <Listbox.Label className="text-slate-800">{label}</Listbox.Label>
      <div className="relative block w-full">
        <Listbox.Button className="relative w-full cursor-default rounded border border-indigo-200 bg-white py-1 pl-3 pr-10 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-indigo-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options
            className={clsx(
              "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
              "absolute mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            )}
          >
            {choices.map((choice) => (
              <Listbox.Option
                key={choice}
                value={choice}
                className="relative cursor-default select-none py-1 pl-10 text-indigo-700 ui-active:bg-indigo-600 ui-active:text-white"
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
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

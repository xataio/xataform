import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

export type DropdownSettingItemProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  choices: T[];
};

export function DropdownSettingItem<T extends string>({
  value,
  onChange,
  choices,
}: DropdownSettingItemProps<T>) {
  return (
    <Listbox
      value={value}
      onChange={onChange}
      className="block w-full focus-within:z-10"
      as="div"
    >
      <div className="relative w-full">
        <Listbox.Button className="relative w-full cursor-default rounded border border-indigo-200 bg-white py-1.5 pl-3 pr-10 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          <span className="block truncate">{value}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-indigo-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
      </div>
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
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

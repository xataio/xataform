import { Switch } from "@headlessui/react";
import clsx from "clsx";

export type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function Toggle({ value, onChange, label }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex w-full items-center justify-between">
      <Switch.Label as="span" className="text-sm text-slate-700">
        {label}
      </Switch.Label>
      <Switch
        checked={value}
        onChange={onChange}
        className={clsx(
          value ? "bg-indigo-600" : "bg-gray-200",
          "relative inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            value ? "translate-x-3" : "translate-x-0",
            "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}

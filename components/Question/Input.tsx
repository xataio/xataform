import { camel } from "case";
import clsx from "clsx";
import { HTMLInputTypeAttribute } from "react";
import { AnswerLayout } from "./AnswerProps";

export type InputProps = {
  type: HTMLInputTypeAttribute;
  disabled: boolean;
  placeholder: string;
  id?: string;
  className?: string;
  label?: string;
  required?: boolean;
};

export function Input({
  type,
  disabled,
  placeholder,
  id,
  className,
  label,
  required,
}: InputProps) {
  const inputId = id ? id : label ? camel(label) : undefined;

  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="text-sm text-indigo-600">
          {label}
          <span className="pl-0.5 text-red-700">{required ? "*" : null}</span>
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        disabled={disabled}
        className={clsx(
          "border-0 border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200",
          "focus:outline-none",
          "p-1 pb-0.5",
          className
        )}
        placeholder={placeholder}
      />
    </div>
  );
}

import clsx from "clsx";
import { HTMLInputTypeAttribute } from "react";
import { AnswerLayout } from "./AnswerProps";

export type InputProps = {
  type: HTMLInputTypeAttribute;
  disabled: boolean;
  placeholder: string;
  id?: string;
  className?: string;
};

export function Input({
  type,
  disabled,
  placeholder,
  id,
  className,
}: InputProps) {
  return (
    <input
      id={id}
      type={type}
      disabled={disabled}
      className={clsx(
        "border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200",
        className
      )}
      placeholder={placeholder}
    />
  );
}

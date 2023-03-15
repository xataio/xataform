import { camel } from "case";
import clsx from "clsx";
import { KeyboardEventHandler } from "react";

export type InputProps = CommonProps & (TextInputProps | NumberInputProps);

type TextInputProps = {
  type: "text" | "email";
  value: string;
  onChange: (value: string) => void;
};

type NumberInputProps = {
  type: "number";
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

type CommonProps = {
  disabled: boolean;
  placeholder: string;
  id?: string;
  className?: string;
  label?: string;
  required?: boolean;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
};

export function Input({
  type,
  disabled,
  placeholder,
  id,
  className,
  label,
  required,
  value,
  onKeyUp,
  onChange,
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
        value={value}
        onKeyUp={onKeyUp}
        onChange={(e) => {
          if (type === "text" || type === "email") {
            onChange(e.currentTarget.value);
          }
          if (type === "number") {
            onChange(
              Number.isFinite(e.currentTarget.valueAsNumber)
                ? e.currentTarget.valueAsNumber
                : undefined
            );
          }
        }}
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

import clsx from "clsx";

export type InputSettingItemProps =
  | {
      maxLength?: number;
      label: string;
      value: string;
      onChange: (value: string) => void;
      type?: "text";
    }
  | {
      type: "number";
      maxLength?: never;
      label: string;
      value: number;
      onChange: (value: number) => void;
    };

export function InputSettingItem({
  value,
  label,
  maxLength,
  onChange,
  type,
}: InputSettingItemProps) {
  return (
    <div className="relative">
      <input
        type={type}
        className={clsx(
          "block w-full rounded border-0 py-1.5 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          maxLength ? "pr-14" : "pr-4"
        )}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={(e) => {
          if (type === "text" || !type) {
            onChange(
              maxLength
                ? e.currentTarget.value.slice(0, maxLength)
                : e.currentTarget.value
            );
          }
          if (type === "number") {
            onChange(e.currentTarget.valueAsNumber);
          }
        }}
      />
      {maxLength && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-sm text-slate-500" id="price-currency">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

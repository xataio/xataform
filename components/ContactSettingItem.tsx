import { Switch } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FocusEvent, MouseEvent, useState } from "react";
import { usePopper } from "react-popper";
import { OptionalIcon } from "./OptionalIcon";
import { RequiredIcon } from "./RequiredIcon";

type Value =
  | {
      required: boolean;
      enabled: true;
    }
  | {
      enabled: false;
    };

export type ContactSettingItemProps = {
  label: string;
  value: Value;
  onChange: (value: Value) => void;
};

export function ContactSettingItem({
  value,
  onChange,
  label,
}: ContactSettingItemProps) {
  const [showTooltip, setShowTooltip] = useState<
    false | "required" | "enabled"
  >(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      {
        name: "preventOverflow",
        options: {
          padding: 8,
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <div>
        <Switch
          aria-label="Enabled"
          checked={value.enabled}
          onChange={(enabled: boolean) => {
            onChange({ enabled, required: false });
          }}
          onFocus={(e: FocusEvent<HTMLButtonElement>) => {
            setReferenceElement(e.currentTarget);
            setShowTooltip("enabled");
          }}
          onMouseOver={(e: MouseEvent<HTMLButtonElement>) => {
            setReferenceElement(e.currentTarget);
            setShowTooltip("enabled");
          }}
          onMouseOut={() => setShowTooltip(false)}
          onBlur={() => setShowTooltip(false)}
        >
          <div
            className={clsx(
              "flex h-7 w-7 items-center justify-center rounded hover:bg-indigo-200"
            )}
          >
            {value.enabled ? (
              <EyeIcon className="h-4 w-4 fill-indigo-500" />
            ) : (
              <EyeSlashIcon className="h-4 w-4 fill-indigo-500" />
            )}
          </div>
        </Switch>
        <Switch
          aria-label="Required"
          disabled={!value.enabled}
          checked={value.enabled ? value.required : false}
          onChange={(required: boolean) => {
            onChange({ enabled: true, required });
          }}
          onFocus={(e: FocusEvent<HTMLButtonElement>) => {
            setReferenceElement(e.currentTarget);
            setShowTooltip("required");
          }}
          onMouseOver={(e: MouseEvent<HTMLButtonElement>) => {
            setReferenceElement(e.currentTarget);
            setShowTooltip("required");
          }}
          onMouseOut={() => setShowTooltip(false)}
          onBlur={() => setShowTooltip(false)}
          className="group"
        >
          <div
            className={clsx(
              "flex h-7 w-7 items-center justify-center rounded hover:bg-indigo-200",
              "fill-indigo-500",
              "group-disabled:fill-slate-400"
            )}
          >
            {value.enabled && value.required ? (
              <RequiredIcon />
            ) : (
              <OptionalIcon />
            )}
          </div>
        </Switch>
      </div>
      {showTooltip ? (
        <div
          id="tooltip"
          role="tooltip"
          aria-hidden="true"
          className="rounded bg-slate-800 py-1 px-2 text-sm text-white"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {showTooltip === "required"
            ? value.enabled && value.required
              ? "Make optional"
              : "Make required"
            : value.enabled
            ? "Hide this field"
            : "Show this field"}
          <div id="arrow" ref={setArrowElement} style={styles.arrow}></div>
        </div>
      ) : null}
    </div>
  );
}

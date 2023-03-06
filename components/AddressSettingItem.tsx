import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { usePopper } from "react-popper";
import { OptionalIcon } from "./OptionalIcon";
import { RequiredIcon } from "./RequiredIcon";

export type AddressSettingItemProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function AddressSettingItem({
  value,
  onChange,
  label,
}: AddressSettingItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
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
      <Switch
        aria-label={label}
        checked={value}
        onChange={onChange}
        onFocus={() => setShowTooltip(true)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        ref={setReferenceElement}
      >
        <div
          className={clsx(
            "flex h-7 w-7 items-center justify-center rounded  hover:bg-indigo-200",
            "fill-indigo-500"
          )}
        >
          {value ? <RequiredIcon /> : <OptionalIcon />}
        </div>
      </Switch>
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
          {value ? "Make this field optional" : "Make this field required"}
          <div id="arrow" ref={setArrowElement} style={styles.arrow}></div>
        </div>
      ) : null}
    </div>
  );
}

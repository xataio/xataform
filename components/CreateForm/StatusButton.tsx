import clsx from "clsx";
import { useCopyToClipboard } from "hooks/useCopyToClipboard";
import { useState } from "react";
import { usePopper } from "react-popper";
import { Form } from "server/routers/form/form.schemas";

export type StatusButtonProps = {
  status: Form["status"];
  unpublishedChanges: Form["unpublishedChanges"];
};

export function StatusButton({
  status,
  unpublishedChanges,
}: StatusButtonProps) {
  const { copy } = useCopyToClipboard();
  const [showTooltip, setShowTooltip] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
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
    <>
      <button
        ref={setReferenceElement}
        onClick={() =>
          copy(
            location.href.split("?")[0].slice(0, "/create".length * -1),
            "Public form url"
          )
        }
        onFocus={() => setShowTooltip(true)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        className={clsx(
          "flex cursor-pointer items-center gap-2 rounded px-2.5 py-1.5 hover:bg-indigo-400",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        )}
      >
        <div
          className={clsx(
            "h-3.5 w-3.5 rounded-full border-2 border-white",
            status === "draft" && "bg-slate-500",
            status === "live" && unpublishedChanges === 0 && "bg-green-600",
            status === "live" && unpublishedChanges > 0 && "bg-orange-500"
          )}
        />
        <p className="text-sm">{status === "draft" ? "Draft" : `Live`}</p>
      </button>
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
          {unpublishedChanges} unpublished change
          {unpublishedChanges === 1 ? "" : "s"}
          <div id="arrow" ref={setArrowElement} style={styles.arrow}></div>
        </div>
      ) : null}
    </>
  );
}

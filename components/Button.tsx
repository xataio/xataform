import {
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
  EyeIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  ArrowPathIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { Placement } from "@popperjs/core";
import clsx from "clsx";
import { ButtonHTMLAttributes, useState } from "react";
import { usePopper } from "react-popper";

export type ButtonProps = ButtonPropsWithoutIcon | ButtonWithIconProps;

type ButtonPropsCommun = {
  children: string;
  onClick?: () => void;
  variant?: "ghost" | "secondary" | "warning";
  isLoading?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

type ButtonPropsWithoutIcon = ButtonPropsCommun & {
  icon?: never;
  iconOnly?: never;
  tooltipPlacement?: never;
};

type ButtonWithIconProps = ButtonPropsCommun & {
  icon:
    | "add"
    | "grid"
    | "list"
    | "preview"
    | "sidebar-left"
    | "sidebar-right"
    | "trash"
    | "reset"
    | "photo"
    | "warning";
  iconOnly?: boolean;
  tooltipPlacement?: Placement;
};

export function Button(props: ButtonProps) {
  const icon = props.isLoading ? "loading" : props.icon;
  const disabled = Boolean(props.disabled || props.isLoading);
  const placement = props.tooltipPlacement ?? "top-start";

  const [showTooltip, setShowTooltip] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
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

  const colorClasses =
    props.variant === "ghost"
      ? "bg-indigo-500 text-white hover:bg-indigo-400"
      : props.variant === "secondary"
      ? "bg-slate-300 text-slate-700 hover:bg-slate-400"
      : props.variant === "warning"
      ? "bg-orange-600 text-white hover:bg-orange-700"
      : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <>
      <button
        ref={setReferenceElement}
        disabled={disabled}
        type={props.type ?? "button"}
        className={clsx(
          "inline-flex items-center rounded border border-transparent px-2.5 py-1.5 text-xs font-medium leading-4 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          colorClasses,
          disabled && "cursor-not-allowed opacity-70"
        )}
        onClick={props.onClick}
        onFocus={() => setShowTooltip(true)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        aria-label={props.children}
      >
        {icon === "reset" ? (
          <ArrowPathIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "loading" ? (
          <ArrowPathIcon
            className={clsx(
              { "mr-2": !props.iconOnly },
              "h-4 w-4 animate-spin"
            )}
            aria-hidden="true"
          />
        ) : null}
        {icon === "add" ? (
          <PlusIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "grid" ? (
          <Squares2X2Icon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "list" ? (
          <ListBulletIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "preview" ? (
          <EyeIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "sidebar-left" ? (
          <ArrowLeftOnRectangleIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "sidebar-right" ? (
          <ArrowRightOnRectangleIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "warning" ? (
          <ExclamationTriangleIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "trash" ? (
          <TrashIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {icon === "photo" ? (
          <PhotoIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {props.iconOnly === true ? null : props.children}
      </button>
      {props.iconOnly && showTooltip ? (
        <div
          id="tooltip"
          role="tooltip"
          aria-hidden="true"
          className="rounded bg-slate-800 py-1 px-2 text-sm text-white"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {props.children}
          <div id="arrow" ref={setArrowElement} style={styles.arrow}></div>
        </div>
      ) : null}
    </>
  );
}

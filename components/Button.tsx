import {
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
  EyeIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import { usePopper } from "react-popper";

export type ButtonProps = ButtonPropsWithoutIcon | ButtonWithIconProps;

type ButtonPropsCommun = {
  children: string;
  onClick?: () => void;
  variant?: "ghost" | "secondary";
};

type ButtonPropsWithoutIcon = ButtonPropsCommun & {
  icon?: never;
  iconOnly?: never;
};

type ButtonWithIconProps = ButtonPropsCommun & {
  icon: "add" | "grid" | "list" | "preview" | "sidebar-left" | "sidebar-right";
  iconOnly?: boolean;
};

export function Button(props: ButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top-start",
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
      : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <>
      <button
        ref={setReferenceElement}
        type="button"
        className={clsx(
          "inline-flex items-center rounded border border-transparent  px-2.5 py-1.5 text-xs font-medium leading-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          colorClasses
        )}
        onClick={props.onClick}
        onFocus={() => setShowTooltip(true)}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
        onBlur={() => setShowTooltip(false)}
        aria-label={props.children}
      >
        {props.icon === "add" ? (
          <PlusIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {props.icon === "grid" ? (
          <Squares2X2Icon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {props.icon === "list" ? (
          <ListBulletIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {props.icon === "preview" ? (
          <EyeIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-4 w-4")}
            aria-hidden="true"
          />
        ) : null}
        {props.icon === "sidebar-left" ? (
          <ArrowLeftOnRectangleIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {props.icon === "sidebar-right" ? (
          <ArrowRightOnRectangleIcon
            className={clsx({ "mr-2": !props.iconOnly }, "h-5 w-5")}
            aria-hidden="true"
          />
        ) : null}
        {props.iconOnly === true ? null : props.children}
      </button>
      {props.iconOnly && showTooltip ? (
        <div
          aria-hidden="true"
          className="rounded bg-slate-800 py-1 px-2 text-sm text-white"
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {props.children}
          <div
            className="h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-slate-800"
            ref={setArrowElement}
            style={styles.arrow}
          ></div>
        </div>
      ) : null}
    </>
  );
}

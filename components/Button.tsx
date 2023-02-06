import {
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
  EyeIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";

export type ButtonProps = {
  children: string;
  onClick?: () => void;
  icon?: "add" | "grid" | "list" | "preview";
  variant?: "ghost";
};

export function Button(props: ButtonProps) {
  const colorClasses =
    props?.variant === "ghost"
      ? "bg-indigo-500 text-white hover:bg-indigo-400"
      : "bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center rounded border border-transparent  px-2.5 py-1.5 text-xs font-medium leading-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        colorClasses
      )}
      onClick={props.onClick}
    >
      {props.icon === "add" ? (
        <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
      ) : null}
      {props.icon === "grid" ? (
        <Squares2X2Icon className="mr-2 h-5 w-5" aria-hidden="true" />
      ) : null}
      {props.icon === "list" ? (
        <ListBulletIcon className="mr-2 h-5 w-5" aria-hidden="true" />
      ) : null}
      {props.icon === "preview" ? (
        <EyeIcon className="mr-2 h-4 w-4" aria-hidden="true" />
      ) : null}
      {props.children}
    </button>
  );
}

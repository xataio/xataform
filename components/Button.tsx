import {
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";

export type ButtonProps = {
  children: string;
  onClick?: () => void;
  icon?: "add" | "grid" | "list";
};

export function Button(props: ButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
      {props.children}
    </button>
  );
}

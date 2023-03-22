import clsx from "clsx";
import { Button } from "components/Button";
import React from "react";
import { AnswerLayout } from "./AnswerProps";

export function AnswerWrapper(props: {
  children: React.ReactNode;
  layout: AnswerLayout;
  onClick?: () => void;
  onFocus?: () => void;
  onSubmit: () => void;
  className?: string;
  isLastAnswer: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      onFocus={props.onFocus}
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "relative col-start-2 mt-8 flex flex-col gap-4"
      )}
    >
      <div
        className={clsx(
          "pr-4 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
          "-m-1 max-h-full overflow-auto p-1",
          "flex flex-col gap-4",
          props.className
        )}
      >
        {props.children}
      </div>
      {props.onClick && (
        <div
          className="absolute inset-0 cursor-pointer"
          role="button"
          onClick={props.onClick}
        />
      )}
      <div className="flex flex-row items-center gap-2">
        <Button type="submit">{props.isLastAnswer ? "Submit" : "OK ✓"}</Button>
        <div className="text-xs">
          press <b>Enter</b>↵
        </div>
      </div>
    </form>
  );
}

function FocusTrap(props: { onFocus: () => void }) {
  return <div tabIndex={0} onFocus={props.onFocus} />;
}

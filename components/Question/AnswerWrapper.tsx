import clsx from "clsx";
import { Button } from "components/Button";
import React from "react";
import { AnswerLayout } from "./AnswerProps";

export function AnswerWrapper(props: {
  children: React.ReactNode;
  layout: AnswerLayout;
}) {
  return (
    <div
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8"
      )}
    >
      {props.children}
      <div className="mt-4 flex flex-row items-center gap-2">
        <Button>OK ✓</Button>
        <div className="text-xs">
          press <b>Enter</b>↵
        </div>
      </div>
    </div>
  );
}

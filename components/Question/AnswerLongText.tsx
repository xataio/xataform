import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";

function AnswerLongText(props: AnswerProps<"longText">) {
  return (
    <div
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8"
      )}
    >
      <input
        type="text"
        disabled={props.admin}
        className={clsx(
          "w-full border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
        )}
        placeholder="Type your answer here…"
      />
      <p className="my-2 text-xs text-indigo-600">
        <b>Shift ⇑ + Enter ↵</b> to make a line break
      </p>
      <div className="flex flex-row items-center gap-2">
        <Button>OK ✓</Button>
        <div className="text-xs">
          press <b>Enter</b>↵
        </div>
      </div>
    </div>
  );
}

export default AnswerLongText;

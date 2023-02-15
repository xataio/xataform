import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerLongText(props: AnswerProps<"longText">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <input
        type="text"
        disabled={props.admin}
        className={clsx(
          "w-full border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
        )}
        placeholder="Type your answer here…"
      />
      <p className="mt-2 text-xs text-indigo-600">
        <b>Shift ⇑ + Enter ↵</b> to make a line break
      </p>
    </AnswerWrapper>
  );
}

export default AnswerLongText;

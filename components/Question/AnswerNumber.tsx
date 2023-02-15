import clsx from "clsx";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerNumber(props: AnswerProps<"number">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <input
        type="number"
        disabled={props.admin}
        className={clsx(
          props.layout === "split" ? "w-fit" : "w-full",
          "border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
        )}
        placeholder="Type your answer here…"
      />
    </AnswerWrapper>
  );
}

export default AnswerNumber;

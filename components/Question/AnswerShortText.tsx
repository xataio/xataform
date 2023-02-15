import clsx from "clsx";
import { AnswerProps } from "./AnswerProps";

function AnswerShortText(props: AnswerProps<"shortText">) {
  return (
    <input
      type="text"
      disabled={props.admin}
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8 border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
      )}
      placeholder="Type your answer here…"
    />
  );
}

export default AnswerShortText;

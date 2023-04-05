import clsx from "clsx";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerLongText(props: AnswerProps<"longText">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState("");

  const onSubmit = () => {
    if (props.admin) return;
    if (props.required && answer === "") {
      setShowRequired(true);
      return;
    }
    props.onSubmit(answer);
  };

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onFocus={props.onFocus}
      showRequired={showRequired}
      keyToSubmit="Shift ⇑ + Enter ↵"
      onSubmit={onSubmit}
    >
      <textarea
        disabled={props.admin}
        placeholder="Type your answer here…"
        value={answer}
        rows={answer.split("\n").length}
        className={clsx(
          "w-full",
          "border-0 border-b border-indigo-200 bg-transparent pb-0.5 text-lg placeholder:text-indigo-200",
          "resize-none focus:outline-none",
          "p-1 pb-0.5"
        )}
        onKeyUp={(e) => {
          if (e.shiftKey && e.key === "Enter") onSubmit();
        }}
        onChange={(e) => {
          setShowRequired(false);
          setAnswer(e.currentTarget.value);
        }}
      />
      <p className="-mt-2 text-xs text-indigo-600">
        <b>Enter ↵</b> to make a line break
      </p>
    </AnswerWrapper>
  );
}

export default AnswerLongText;

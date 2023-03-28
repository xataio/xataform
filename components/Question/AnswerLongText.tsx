import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerLongText(props: AnswerProps<"longText">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState("");

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onFocus={props.onFocus}
      showRequired={showRequired}
      onSubmit={() => {
        if (props.admin) return;
        if (props.required && answer === "") {
          setShowRequired(true);
          return;
        }
        props.onSubmit(answer);
      }}
    >
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
        value={answer}
        onChange={(value) => {
          setShowRequired(false);
          setAnswer(value);
        }}
      />
      <p className="-mt-2 text-xs text-indigo-600">
        <b>Shift ⇑ + Enter ↵</b> to make a line break
      </p>
    </AnswerWrapper>
  );
}

export default AnswerLongText;

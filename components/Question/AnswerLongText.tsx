import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerLongText(props: AnswerProps<"longText">) {
  const [answer, setAnswer] = useState("");

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onFocus={props.onFocus}
      onSubmit={() => {
        if (props.admin) return;
        props.onSubmit(answer);
      }}
    >
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
        value={answer}
        onChange={setAnswer}
      />
      <p className="-mt-2 text-xs text-indigo-600">
        <b>Shift ⇑ + Enter ↵</b> to make a line break
      </p>
    </AnswerWrapper>
  );
}

export default AnswerLongText;

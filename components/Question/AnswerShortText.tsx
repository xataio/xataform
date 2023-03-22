import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerShortText(props: AnswerProps<"shortText">) {
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
    </AnswerWrapper>
  );
}

export default AnswerShortText;

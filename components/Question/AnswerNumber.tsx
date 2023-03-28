import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerNumber(props: AnswerProps<"number">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState<number>();
  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      showRequired={showRequired}
      onFocus={props.onFocus}
      onSubmit={() => {
        if (props.admin) return;
        if (props.required && answer === undefined) {
          setShowRequired(true);
          return;
        }
        props.onSubmit(answer ?? null);
      }}
    >
      <Input
        type="number"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
        value={answer}
        onChange={(value) => {
          setShowRequired(false);
          setAnswer(value);
        }}
      />
    </AnswerWrapper>
  );
}

export default AnswerNumber;

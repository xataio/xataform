import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerShortText(props: AnswerProps<"shortText">) {
  const [answer, setAnswer] = useState("");
  const [showRequired, setShowRequired] = useState(false);

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
        required={props.required}
        className="w-full"
        placeholder="Type your answer here…"
        value={answer}
        onChange={(value) => {
          setAnswer(value);
          setShowRequired(false);
        }}
      />
    </AnswerWrapper>
  );
}

export default AnswerShortText;

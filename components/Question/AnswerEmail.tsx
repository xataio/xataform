import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerEmail(props: AnswerProps<"email">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState("");
  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      showRequired={showRequired}
      onFocus={props.onFocus}
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
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="name@example.com"
        value={answer}
        onChange={(value) => {
          setShowRequired(false);
          setAnswer(value);
        }}
      />
    </AnswerWrapper>
  );
}

export default AnswerEmail;

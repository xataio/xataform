import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerWebsite(props: AnswerProps<"website">) {
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
        placeholder="https://"
        value={answer}
        onChange={(value) => {
          setAnswer(value);
          setShowRequired(false);
        }}
      />
    </AnswerWrapper>
  );
}

export default AnswerWebsite;

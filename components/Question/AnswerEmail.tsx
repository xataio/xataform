import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerEmail(props: AnswerProps<"email">) {
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
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="name@example.com"
        value={answer}
        onChange={setAnswer}
      />
    </AnswerWrapper>
  );
}

export default AnswerEmail;

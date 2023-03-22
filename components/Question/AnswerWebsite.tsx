import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerWebsite(props: AnswerProps<"website">) {
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
        placeholder="https://"
        value={answer}
        onChange={setAnswer}
      />
    </AnswerWrapper>
  );
}

export default AnswerWebsite;

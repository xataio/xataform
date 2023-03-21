import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

// TODO: Integrate the following library to have a crazy UX
// https://github.com/jackocnr/intl-tel-input
function AnswerPhoneNumber(props: AnswerProps<"phoneNumber">) {
  const [answer, setAnswer] = useState("");
  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onSubmit={() => {
        if (props.admin) return;
        props.onSubmit(answer);
      }}
    >
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="+34 1 23 45 67 89"
        value={answer}
        onChange={setAnswer}
      />
    </AnswerWrapper>
  );
}

export default AnswerPhoneNumber;

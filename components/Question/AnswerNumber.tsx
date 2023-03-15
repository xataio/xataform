import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerNumber(props: AnswerProps<"number">) {
  const [answer, setAnswer] = useState<number>();
  return (
    <AnswerWrapper
      layout={props.layout}
      onSubmit={() => {
        if (props.admin || answer === undefined) return;
        props.onSubmit(answer);
      }}
    >
      <Input
        type="number"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
        value={answer}
        onChange={setAnswer}
      />
    </AnswerWrapper>
  );
}

export default AnswerNumber;

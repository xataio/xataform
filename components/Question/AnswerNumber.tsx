import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerNumber(props: AnswerProps<"number">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="number"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
      />
    </AnswerWrapper>
  );
}

export default AnswerNumber;

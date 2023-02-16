import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerShortText(props: AnswerProps<"shortText">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
      />
    </AnswerWrapper>
  );
}

export default AnswerShortText;

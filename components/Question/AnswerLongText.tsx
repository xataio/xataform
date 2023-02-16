import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerLongText(props: AnswerProps<"longText">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Type your answer here…"
      />
      <p className="mt-2 text-xs text-indigo-600">
        <b>Shift ⇑ + Enter ↵</b> to make a line break
      </p>
    </AnswerWrapper>
  );
}

export default AnswerLongText;

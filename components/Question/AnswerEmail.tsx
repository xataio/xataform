import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerEmail(props: AnswerProps<"email">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="name@example.com"
      />
    </AnswerWrapper>
  );
}

export default AnswerEmail;

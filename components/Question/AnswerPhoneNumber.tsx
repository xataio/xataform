import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

// TODO: Integrate the following library to have a crazy UX
// https://github.com/jackocnr/intl-tel-input
function AnswerPhoneNumber(props: AnswerProps<"phoneNumber">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="+34 1 23 45 67 89"
      />
    </AnswerWrapper>
  );
}

export default AnswerPhoneNumber;

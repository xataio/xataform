import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

function AnswerWebsite(props: AnswerProps<"website">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="https://"
      />
    </AnswerWrapper>
  );
}

export default AnswerWebsite;

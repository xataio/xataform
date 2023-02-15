import clsx from "clsx";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerEmail(props: AnswerProps<"email">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <input
        type="email"
        disabled={props.admin}
        className={clsx(
          props.layout === "split" ? "w-fit" : "w-full",
          "border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
        )}
        placeholder="name@example.com"
      />
    </AnswerWrapper>
  );
}

export default AnswerEmail;

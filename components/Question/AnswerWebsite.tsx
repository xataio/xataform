import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerWebsite(props: AnswerProps<"website">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <input
        type="text"
        disabled={props.admin}
        className={clsx(
          props.layout === "split" ? "w-fit" : "w-full",
          "border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
        )}
        placeholder="https://"
      />
    </AnswerWrapper>
  );
}

export default AnswerWebsite;

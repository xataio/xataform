import clsx from "clsx";
import { AnswerProps } from "./AnswerProps";

function AnswerEmail(props: AnswerProps<"email">) {
  return (
    <input
      type="email"
      disabled={props.editable}
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8 border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200"
      )}
      placeholder="name@example.com"
    />
  );
}

export default AnswerEmail;

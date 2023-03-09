import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";

function AnswerStatement(props: AnswerProps<"statement">) {
  return (
    <div
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Button>{props.buttonText || "Continue"}</Button>
        <div className="text-xs">
          press <b>Enter</b>↵
        </div>
      </div>
    </div>
  );
}

export default AnswerStatement;

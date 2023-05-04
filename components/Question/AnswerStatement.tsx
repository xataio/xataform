import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";

function AnswerStatement(props: AnswerProps<"statement">) {
  return (
    <form
      className={clsx(
        props.layout === "split" ? "w-fit" : "w-full",
        "col-start-2 mt-8"
      )}
      onFocus={props.onFocus}
      onSubmit={(e) => {
        e.preventDefault();
        if (props.admin) return;
        props.onSubmit(null);
      }}
    >
      <div className="flex flex-row items-center gap-2">
        <Button type="submit">
          {props.buttonText || (props.isLastQuestion ? "Submit" : "Continue")}
        </Button>
        <div className="hidden text-xs sm:block">
          press <b>Enter</b>↵
        </div>
      </div>
    </form>
  );
}

export default AnswerStatement;

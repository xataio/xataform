import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerYesNo(props: AnswerProps<"yesNo">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState<"yes" | "no">();

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      showRequired={showRequired}
      onFocus={props.onFocus}
      onSubmit={() => {
        if (props.admin) return;
        if (props.required && answer === undefined) {
          setShowRequired(true);
          return;
        }
        props.onSubmit(answer ? answer === "yes" : null);
      }}
    >
      <RadioGroup
        className="flex flex-col gap-2"
        value={answer}
        onChange={(value: "yes" | "no") => {
          setShowRequired(false);
          setAnswer(value);
        }}
        disabled={props.admin}
      >
        <Option value="yes">Yes</Option>
        <Option value="no">No</Option>
      </RadioGroup>
    </AnswerWrapper>
  );
}

export default AnswerYesNo;

function Option({ value, children }: { value: string; children: string }) {
  return (
    <RadioGroup.Option
      value={value}
      className={({ checked }) =>
        clsx(
          "focus:outline-none focus:ring-2 hover:bg-indigo-200",
          "flex w-40 cursor-pointer flex-row items-center justify-between gap-2 rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700",
          checked && "bg-indigo-200 font-medium ring-1 ring-indigo-700"
        )
      }
    >
      {({ checked }) => (
        <>
          <span>{children}</span>
          {checked && <CheckIcon className="h-4 w-4" />}
        </>
      )}
    </RadioGroup.Option>
  );
}

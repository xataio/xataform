import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerLegal(props: AnswerProps<"legal">) {
  const [answer, setAnswer] = useState<"yes" | "no">();
  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onSubmit={() => {
        if (props.admin || answer === undefined) return;
        props.onSubmit(answer === "yes");
      }}
    >
      <RadioGroup
        className="flex flex-col gap-2"
        value={answer}
        onChange={setAnswer}
      >
        <Option value="yes">I accept</Option>
        <Option value="no">I don’t accept</Option>
      </RadioGroup>
    </AnswerWrapper>
  );
}

export default AnswerLegal;

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

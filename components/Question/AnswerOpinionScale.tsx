import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerOpinionScale(props: AnswerProps<"opinionScale">) {
  const [answer, setAnswer] = useState("");

  const count = props.max - props.min + 1;

  return (
    <AnswerWrapper
      layout="full"
      isLastAnswer={props.isLastQuestion}
      onSubmit={() => {
        if (props.admin) return;
        const answerAsNumber = Number.parseInt(answer);
        if (Number.isFinite(answerAsNumber)) {
          props.onSubmit(answerAsNumber);
        }
      }}
    >
      <div
        style={{
          maxWidth: count * (56 + 8),
        }}
      >
        <RadioGroup
          className={`grid gap-2`}
          style={{
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          }}
          value={answer}
          onChange={setAnswer}
        >
          {new Array(count).fill(0).map((_, index) => (
            <Option
              key={props.min + index}
              value={(props.min + index).toString()}
            >
              {(props.min + index).toString()}
            </Option>
          ))}
        </RadioGroup>
        {(props.labelMin || props.labelMed || props.labelMax) && (
          <div className="mt-2 grid w-full grid-cols-3 text-sm text-indigo-500">
            <div className="text-start">{props.labelMin}</div>
            <div className="text-center">{props.labelMed}</div>
            <div className="text-end">{props.labelMax}</div>
          </div>
        )}
      </div>
    </AnswerWrapper>
  );
}

export default AnswerOpinionScale;

function Option({ value, children }: { value: string; children: string }) {
  return (
    <RadioGroup.Option
      value={value}
      className={({ checked }) =>
        clsx(
          "focus:outline-none focus:ring-2 hover:bg-indigo-200",
          "flex h-14 cursor-pointer flex-row items-center justify-center gap-2 rounded border border-indigo-700 bg-indigo-100 text-indigo-700",
          checked && "bg-indigo-200 font-medium ring-1 ring-indigo-700"
        )
      }
    >
      <span>{children}</span>
    </RadioGroup.Option>
  );
}

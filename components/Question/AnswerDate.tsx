import { title } from "case";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

const clamp = (value: string, min: number, max: number) =>
  Number.isFinite(Number.parseInt(value))
    ? Math.min(Math.max(min, Number.parseInt(value)), max).toString()
    : "";

function AnswerDate(props: AnswerProps<"date">) {
  const [answer, setAnswer] = useState({
    day: "",
    month: "",
    year: "",
  });

  const setField = (field: keyof typeof answer) => (value: string) =>
    setAnswer((prev) => {
      switch (field) {
        case "day":
          return { ...prev, [field]: clamp(value, 1, 31) };
        case "month":
          return { ...prev, [field]: clamp(value, 1, 12) };
        case "year":
          return {
            ...prev,
            [field]: (Number.isFinite(Number.parseInt(value))
              ? Math.round(+value)
              : ""
            ).toString(),
          };
      }
    });

  return (
    <AnswerWrapper
      layout={props.layout}
      onSubmit={() => {
        if (props.admin) return;
        if (props.format === "DDMMYY") {
          props.onSubmit(
            `${answer.day}${props.separator}${answer.month}${props.separator}${answer.year}`
          );
        } else {
          props.onSubmit(
            `${answer.month}${props.separator}${answer.day}${props.separator}${answer.year}`
          );
        }
      }}
    >
      <div className="flex flex-row items-end gap-2">
        {props.format === "DDMMYY" ? (
          <>
            <DatePart
              type="day"
              disabled={props.admin}
              value={answer.day}
              onChange={setField("day")}
            />
            <div className="text-lg font-semibold text-indigo-600">
              {props.separator}
            </div>
            <DatePart
              type="month"
              disabled={props.admin}
              value={answer.month}
              onChange={setField("month")}
            />
          </>
        ) : (
          <>
            <DatePart
              type="month"
              disabled={props.admin}
              value={answer.month}
              onChange={setField("month")}
            />
            <div className="text-lg font-semibold text-indigo-600">
              {props.separator}
            </div>
            <DatePart
              type="day"
              disabled={props.admin}
              value={answer.day}
              onChange={setField("day")}
            />
          </>
        )}

        <div className="text-lg font-semibold text-indigo-600">
          {props.separator}
        </div>
        <DatePart
          type="year"
          disabled={props.admin}
          value={answer.year}
          onChange={setField("year")}
        />
      </div>
    </AnswerWrapper>
  );
}

function DatePart({
  type,
  disabled,
  value,
  onChange,
}: {
  type: "month" | "day" | "year";
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={type} className="text-[0.7rem] text-indigo-700">
        {title(type)}
      </label>
      <Input
        id={type}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={type === "year" ? "w-20" : "w-10"}
        placeholder={type === "year" ? "YYYY" : type === "month" ? "MM" : "DD"}
        onKeyUp={(e) => {
          if (e.key === "ArrowUp") {
            onChange((Number.parseInt(value) + 1).toString());
          }
          if (e.key === "ArrowDown") {
            onChange((Number.parseInt(value) - 1).toString());
          }
        }}
      />
    </div>
  );
}

export default AnswerDate;

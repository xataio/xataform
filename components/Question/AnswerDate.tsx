import { title } from "case";
import clsx from "clsx";
import { Button } from "components/Button";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerLongText(props: AnswerProps<"date">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <div className="flex flex-row items-end gap-2">
        {props.format === "DDMMYY" ? (
          <>
            <DatePart type="day" disabled={props.admin} />
            <div className="text-lg font-semibold text-indigo-600">
              {props.separator}
            </div>
            <DatePart type="month" disabled={props.admin} />
          </>
        ) : (
          <>
            <DatePart type="month" disabled={props.admin} />
            <div className="text-lg font-semibold text-indigo-600">
              {props.separator}
            </div>
            <DatePart type="day" disabled={props.admin} />
          </>
        )}

        <div className="text-lg font-semibold text-indigo-600">
          {props.separator}
        </div>
        <DatePart type="year" disabled={props.admin} />
      </div>
    </AnswerWrapper>
  );
}

function DatePart({
  type,
  disabled,
}: {
  type: "month" | "day" | "year";
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={type} className="text-[0.7rem] text-indigo-700">
        {title(type)}
      </label>
      <input
        id={type}
        type="text"
        disabled={disabled}
        className={clsx(
          "border-b border-indigo-200 bg-white pb-0.5 text-lg placeholder:text-indigo-200",
          type === "year" ? "w-20" : "w-10"
        )}
        placeholder={type === "year" ? "YYYY" : type === "month" ? "MM" : "DD"}
      />
    </div>
  );
}

export default AnswerLongText;

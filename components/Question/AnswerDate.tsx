import { title } from "case";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";

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
      <Input
        id={type}
        type="text"
        disabled={disabled}
        className={type === "year" ? "w-20" : "w-10"}
        placeholder={type === "year" ? "YYYY" : type === "month" ? "MM" : "DD"}
      />
    </div>
  );
}

export default AnswerLongText;

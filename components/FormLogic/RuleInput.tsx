import { Dropdown } from "components/Dropdown";
import { Rule } from "server/routers/logic/logic.schemas";

export type RuleInputProps<T extends Rule> = {
  questionType: T["questionType"];
  value: {
    value: T["value"];
    operation: T["operation"];
  };
  onChange: (value: { value: T["value"]; operation: T["operation"] }) => void;
};

export function RuleInput<T extends Rule>(props: RuleInputProps<T>) {
  return (
    <div className="flex w-full flex-row gap-2">
      <Dropdown
        hideLabel
        label="Operation"
        value={props.value.operation}
        onChange={(operation) =>
          props.onChange({ value: props.value.value, operation })
        }
        choices={["equal", "not equal", "is", "is not"]}
      />
      <input
        type="text"
        className="w-full rounded border-indigo-200 bg-white py-1 pl-3 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        placeholder="value"
      />
    </div>
  );
}

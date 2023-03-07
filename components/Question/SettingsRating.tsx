import { DropdownSettingItem } from "components/DropdownSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsRating({
  questionId,
  formId,
  ...question
}: SettingsProps<"rating">) {
  const updateOption = useUpdateQuestionOption({
    questionId,
    formId,
    question,
  });

  return (
    <>
      <Toggle
        label="Required"
        value={question.required}
        onChange={updateOption("required")}
      />
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <DropdownSettingItem
          value={question.steps}
          choices={[3, 4, 5, 6, 7, 8, 9, 10]}
          onChange={updateOption("steps")}
        />
        <span>Stars</span>
      </div>
    </>
  );
}

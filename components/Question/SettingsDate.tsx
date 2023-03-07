import { DropdownSettingItem } from "components/DropdownSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsDate({
  questionId,
  formId,
  ...question
}: SettingsProps<"date">) {
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
      <h3 className="text-sm text-slate-700">Date Format</h3>
      <DropdownSettingItem
        value={question.format}
        onChange={updateOption("format")}
        choices={["DDMMYY", "MMDDYYYY"]}
      />
      <DropdownSettingItem
        value={question.separator}
        onChange={updateOption("separator")}
        choices={["/", "-", "."]}
      />
    </>
  );
}

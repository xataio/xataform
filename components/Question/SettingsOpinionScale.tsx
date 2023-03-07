import { DropdownSettingItem } from "components/DropdownSettingItem";
import { InputSettingItem } from "components/InputSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsOpinionScale({
  questionId,
  formId,
  ...question
}: SettingsProps<"opinionScale">) {
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
          value={question.min}
          onChange={updateOption("min")}
          choices={[0, 1]}
        />
        <span>to</span>
        <DropdownSettingItem
          value={question.max}
          onChange={updateOption("max")}
          choices={[5, 6, 7, 8, 9, 10]}
        />
      </div>
      <InputSettingItem
        label="Label min"
        value={question.labelMin}
        onChange={updateOption("labelMin")}
        maxLength={24}
      />
      <InputSettingItem
        label="Label med"
        value={question.labelMed}
        onChange={updateOption("labelMed")}
        maxLength={24}
      />
      <InputSettingItem
        label="Label max"
        value={question.labelMax}
        onChange={updateOption("labelMax")}
        maxLength={24}
      />
    </>
  );
}

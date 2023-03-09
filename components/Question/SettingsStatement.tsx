import { InputSettingItem } from "components/InputSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsStatement({
  questionId,
  formId,
  ...question
}: SettingsProps<"statement">) {
  const updateOption = useUpdateQuestionOption({
    questionId,
    formId,
    question,
  });

  return (
    <>
      <Toggle
        label="Quotation marks"
        value={question.hasQuotationMarks}
        onChange={updateOption("hasQuotationMarks")}
      />
      <h3 className="text-sm text-slate-700">Button</h3>
      <InputSettingItem
        label="Button"
        value={question.buttonText}
        onChange={updateOption("buttonText")}
        maxLength={24}
      />
    </>
  );
}

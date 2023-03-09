import { InputSettingItem } from "components/InputSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsNumber({
  questionId,
  formId,
  ...question
}: SettingsProps<"number">) {
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
      <Toggle
        label="Min number"
        value={question.min !== null}
        onChange={(val) => updateOption("min")(val ? 0 : null)}
      />
      {question.min !== null && (
        <InputSettingItem
          type="number"
          label="Min number"
          value={question.min}
          onChange={(val) =>
            updateOption("min")(Number.isFinite(val) ? Math.max(0, val) : 0)
          }
        />
      )}
      <Toggle
        label="Max number"
        value={question.max !== null}
        onChange={(val) => updateOption("max")(val ? 0 : null)}
      />
      {question.max !== null && (
        <InputSettingItem
          type="number"
          label="Max number"
          value={question.max}
          onChange={(val) =>
            updateOption("max")(Number.isFinite(val) ? Math.max(0, val) : 0)
          }
        />
      )}
    </>
  );
}

import { InputSettingItem } from "components/InputSettingItem";
import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsShortText({
  questionId,
  formId,
  ...question
}: SettingsProps<"shortText">) {
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
        label="Max characters"
        value={question.maxLength !== null}
        onChange={(val) => updateOption("maxLength")(val ? 0 : null)}
      />
      {question.maxLength !== null && (
        <InputSettingItem
          type="number"
          label="Max characters"
          value={question.maxLength}
          onChange={(val) =>
            updateOption("maxLength")(
              Number.isFinite(val) ? Math.max(0, val) : 0
            )
          }
        />
      )}
    </>
  );
}

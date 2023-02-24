import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsLongText({
  questionId,
  formId,
  ...question
}: SettingsProps<"longText">) {
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
      {/* TODO: maxLenght */}
    </>
  );
}

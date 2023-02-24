import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsMatrix({
  questionId,
  formId,
  ...question
}: SettingsProps<"matrix">) {
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
        label="Multiple selection"
        value={question.multipleSelection}
        onChange={updateOption("multipleSelection")}
      />
    </>
  );
}

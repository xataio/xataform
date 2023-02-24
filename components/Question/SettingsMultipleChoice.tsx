import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsMultipleChoice({
  questionId,
  formId,
  ...question
}: SettingsProps<"multipleChoice">) {
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
        label="Randomize"
        value={question.randomize}
        onChange={updateOption("randomize")}
      />
      <Toggle
        label="Other option"
        value={question.otherOption}
        onChange={updateOption("otherOption")}
      />
    </>
  );
}

import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsRanking({
  questionId,
  formId,
  ...question
}: SettingsProps<"ranking">) {
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
    </>
  );
}

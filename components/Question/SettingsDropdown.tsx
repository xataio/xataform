import { Toggle } from "components/Toggle";
import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsDropdown({
  questionId,
  formId,
  ...question
}: SettingsProps<"dropdown">) {
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
        label="Alphabetical order"
        value={question.alphabeticalOrder}
        onChange={updateOption("alphabeticalOrder")}
      />
    </>
  );
}

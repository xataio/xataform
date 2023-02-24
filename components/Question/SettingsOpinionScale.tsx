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
      {/* TODO: min */}
      {/* TODO: max */}
      {/* TODO: label min */}
      {/* TODO: label med */}
      {/* TODO: label max */}
    </>
  );
}

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
        label="Has quotation marks"
        value={question.hasQuotationMarks}
        onChange={updateOption("hasQuotationMarks")}
      />
      {/* TODO: implement quotation marks */}
      {/* TODO: buttonText */}
    </>
  );
}

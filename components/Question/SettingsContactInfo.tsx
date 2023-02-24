import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsContactInfo({
  questionId,
  formId,
  ...question
}: SettingsProps<"contactInfo">) {
  const updateOption = useUpdateQuestionOption({
    questionId,
    formId,
    question,
  });

  return <>Not Implemented</>;
}

import { useUpdateQuestionOption } from "hooks/useUpdateQuestionOption";
import { SettingsProps } from "./SettingsProps";

export default function SettingsAddress({
  questionId,
  formId,
  ...question
}: SettingsProps<"address">) {
  const updateOption = useUpdateQuestionOption({
    questionId,
    formId,
    question,
  });

  return <>Not Implemented</>;
}

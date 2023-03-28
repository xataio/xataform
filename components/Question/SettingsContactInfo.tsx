import { ContactSettingItem } from "components/ContactSettingItem";
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

  updateOption("email");
  return (
    <>
      <ContactSettingItem
        label="First name"
        value={question.firstName}
        onChange={updateOption("firstName")}
      />
      <ContactSettingItem
        label="Last name"
        value={question.lastName}
        onChange={updateOption("lastName")}
      />
      <ContactSettingItem
        label="Phone number"
        value={question.phoneNumber}
        onChange={updateOption("phoneNumber")}
      />
      <ContactSettingItem
        label="Email"
        value={question.email}
        onChange={updateOption("email")}
      />
      <ContactSettingItem
        label="Company"
        value={question.company}
        onChange={updateOption("company")}
      />
    </>
  );
}

import { AddressSettingItem } from "components/AddressSettingItem";
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

  return (
    <>
      <AddressSettingItem
        label="Address"
        value={question.addressRequired}
        onChange={updateOption("addressRequired")}
      />
      <AddressSettingItem
        label="Address line 2"
        value={question.address2Required}
        onChange={updateOption("address2Required")}
      />
      <AddressSettingItem
        label="City/Town"
        value={question.cityTownRequired}
        onChange={updateOption("cityTownRequired")}
      />
      <AddressSettingItem
        label="State/Region/Province"
        value={question.stateRegionProviceRequired}
        onChange={updateOption("stateRegionProviceRequired")}
      />
      <AddressSettingItem
        label="Zip/Post code"
        value={question.zipCodeRequired}
        onChange={updateOption("zipCodeRequired")}
      />
      <AddressSettingItem
        label="Country"
        value={question.countryRequired}
        onChange={updateOption("countryRequired")}
      />
    </>
  );
}

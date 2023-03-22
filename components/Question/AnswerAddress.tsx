import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";
import { useState } from "react";

function AnswerAddress(props: AnswerProps<"address">) {
  const [answer, setAnswer] = useState({
    address: "",
    address2: "",
    cityTown: "",
    stateRegionProvince: "",
    zipCode: "",
    country: "",
  });
  const setField = (field: keyof typeof answer) => (value: string) =>
    setAnswer((prev) => ({ ...prev, [field]: value }));

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onFocus={props.onFocus}
      onSubmit={() => {
        if (props.admin) return;
        props.onSubmit(answer);
      }}
    >
      <Input
        label="Address"
        required={props.addressRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="308 Negra Arrayo Lane"
        value={answer.address}
        onChange={setField("address")}
      />
      <Input
        label="Address line 2"
        required={props.address2Required}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="-"
        value={answer.address2}
        onChange={setField("address2")}
      />
      <Input
        label="City/Town"
        required={props.cityTownRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Albuquerque"
        value={answer.cityTown}
        onChange={setField("cityTown")}
      />
      <Input
        label="Zip code"
        required={props.zipCodeRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="87104"
        value={answer.zipCode}
        onChange={setField("zipCode")}
      />
      <Input
        label="State/Region/Province"
        required={props.stateRegionProvinceRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="New Mexico"
        value={answer.stateRegionProvince}
        onChange={setField("stateRegionProvince")}
      />
      <Input
        label="Country"
        required={props.countryRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="USA"
        value={answer.country}
        onChange={setField("country")}
      />
    </AnswerWrapper>
  );
}

export default AnswerAddress;

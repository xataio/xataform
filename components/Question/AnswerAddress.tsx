import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";
import { kebab } from "case";

function AnswerAddress(props: AnswerProps<"address">) {
  return (
    <AnswerWrapper layout={props.layout}>
      <Input
        label="Address"
        required={props.addressRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="308 Negra Arrayo Lane"
      />
      <Input
        label="Address line 2"
        required={props.address2Required}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="-"
      />
      <Input
        label="City/Town"
        required={props.cityTownRequired}
        type="text"
        disabled={props.admin}
        className="w-full"
        placeholder="Albuquerque"
      />
      <Input
        label="Zip code"
        required={props.zipCodeRequired}
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="87104"
      />
      <Input
        label="State/Region/Province"
        required={props.stateRegionProviceRequired}
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="New Mexico"
      />
      <Input
        label="Country"
        required={props.countryRequired}
        type="email"
        disabled={props.admin}
        className="w-full"
        placeholder="USA"
      />
    </AnswerWrapper>
  );
}

export default AnswerAddress;

import { useMemo } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";
import { kebab } from "case";

function AnswerContactInfo(props: AnswerProps<"contactInfo">) {
  const [firstName, lastName] = useMemo(() => {
    return getDadJokeName().split(" ");
  }, []);

  return (
    <AnswerWrapper layout={props.layout}>
      {props.firstName.enabled && (
        <Input
          label="First name"
          required={props.firstName.required}
          type="text"
          disabled={props.admin}
          className="w-full"
          placeholder={firstName}
        />
      )}
      {props.lastName.enabled && (
        <Input
          label="Last name"
          required={props.lastName.required}
          type="text"
          disabled={props.admin}
          className="w-full"
          placeholder={lastName}
        />
      )}
      {props.phoneNumber.enabled && (
        <Input
          label="Phone number"
          required={props.phoneNumber.required}
          type="text"
          disabled={props.admin}
          className="w-full"
          placeholder="+34 1 23 45 67 89"
        />
      )}
      {props.email.enabled && (
        <Input
          label="Email"
          required={props.email.required}
          type="email"
          disabled={props.admin}
          className="w-full"
          placeholder={`${kebab(firstName + " " + lastName)}@xata.io`}
        />
      )}
      {props.company.enabled && (
        <Input
          label="Company"
          required={props.company.required}
          type="email"
          disabled={props.admin}
          className="w-full"
          placeholder="Xata"
        />
      )}
    </AnswerWrapper>
  );
}

export default AnswerContactInfo;

function getDadJokeName() {
  return [
    "Al E.Gater",
    "Helen Hywater",
    "Amanda Lynn",
    "Herbie Hind",
    "Anita Room",
    "Holly Wood",
    "Arty Fischel",
    "Horace Cope",
    "Barry D.Hatchett",
    "Hugh Raye",
    "Ben Dover",
    "Ima Hogg",
    "Bennie Factor",
    "Iona Mink",
    "Carole Singer",
    "Jack Pott",
    "Chester Minit",
    "Jay Walker",
    "Crystal Ball",
    "Jim Nasium",
    "Dick Tate",
    "Joe King",
    "Dinah Mite",
    "Justin Thyme",
    "Don Keigh",
    "Kay Oss",
  ].sort(() => Math.random() - 0.5)[0];
}

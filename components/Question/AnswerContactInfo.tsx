import { useMemo, useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { Input } from "./Input";
import { kebab } from "case";

function AnswerContactInfo(props: AnswerProps<"contactInfo">) {
  const [showRequired, setShowRequired] = useState(false);
  const [answer, setAnswer] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    company: "",
  });

  const [firstName, lastName] = useMemo(() => {
    return getDadJokeName().split(" ");
  }, []);

  const setField = (field: keyof typeof answer) => (value: string) => {
    setShowRequired(false);
    setAnswer((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnswerWrapper
      layout={props.layout}
      isLastAnswer={props.isLastQuestion}
      onFocus={props.onFocus}
      showRequired={showRequired}
      onSubmit={() => {
        if (props.admin) return;
        if (
          answer.firstName === "" &&
          props.firstName.enabled &&
          props.firstName.required
        ) {
          setShowRequired(true);
          return;
        }
        if (
          answer.lastName === "" &&
          props.lastName.enabled &&
          props.lastName.required
        ) {
          setShowRequired(true);
          return;
        }
        if (
          answer.phoneNumber === "" &&
          props.phoneNumber.enabled &&
          props.phoneNumber.required
        ) {
          setShowRequired(true);
          return;
        }
        if (
          answer.email === "" &&
          props.email.enabled &&
          props.email.required
        ) {
          setShowRequired(true);
          return;
        }
        if (
          answer.company === "" &&
          props.company.enabled &&
          props.company.required
        ) {
          setShowRequired(true);
          return;
        }
        props.onSubmit(answer);
      }}
    >
      {props.firstName.enabled && (
        <Input
          label="First name"
          required={props.firstName.required}
          type="text"
          disabled={props.admin}
          className="w-full"
          placeholder={firstName}
          value={answer.firstName}
          onChange={setField("firstName")}
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
          value={answer.lastName}
          onChange={setField("lastName")}
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
          value={answer.phoneNumber}
          onChange={setField("phoneNumber")}
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
          value={answer.email}
          onChange={setField("email")}
        />
      )}
      {props.company.enabled && (
        <Input
          label="Company"
          required={props.company.required}
          type="text"
          disabled={props.admin}
          className="w-full"
          placeholder="Xata"
          value={answer.company}
          onChange={setField("company")}
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

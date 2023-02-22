import { QuestionType } from "server/routers/question/question.schemas";
import { AnswerProps } from "./AnswerProps";
import dynamic from "next/dynamic";
import { Spinner } from "components/Spinner";

// Lazy load every answers
const AnswerShortText = dynamic(() => import("./AnswerShortText"), {
  loading: Spinner,
});
const AnswerLongText = dynamic(() => import("./AnswerLongText"), {
  loading: Spinner,
});
const AnswerEmail = dynamic(() => import("./AnswerEmail"), {
  loading: Spinner,
});
const AnswerNumber = dynamic(() => import("./AnswerNumber"), {
  loading: Spinner,
});
const AnswerDate = dynamic(() => import("./AnswerDate"), {
  loading: Spinner,
});
const AnswerStatement = dynamic(() => import("./AnswerStatement"), {
  loading: Spinner,
});
const AnswerWebsite = dynamic(() => import("./AnswerWebsite"), {
  loading: Spinner,
});
const AnswerYesNo = dynamic(() => import("./AnswerYesNo"), {
  loading: Spinner,
});
const AnswerPhoneNumber = dynamic(() => import("./AnswerPhoneNumber"), {
  loading: Spinner,
});
const AnswerDropdown = dynamic(() => import("./AnswerDropdown"), {
  loading: Spinner,
});
const AnswerMultipleChoice = dynamic(() => import("./AnswerMultipleChoice"), {
  loading: Spinner,
});
const AnswerContactInfo = dynamic(() => import("./AnswerContactInfo"), {
  loading: Spinner,
});
const AnswerRanking = dynamic(() => import("./AnswerRanking"), {
  loading: Spinner,
});
const AnswerRating = dynamic(() => import("./AnswerRating"), {
  loading: Spinner,
});
const AnswerAddress = dynamic(() => import("./AnswerAddress"), {
  loading: Spinner,
});

// Transforms `AnswerProps<T>` to `AnswerProps<"shortText"> | AnswerProps<"longText"> | …`
// This is to enable proper type narrowing in our component switch cases
type AnswerPropsUnion<T> = T extends QuestionType ? AnswerProps<T> : never;

export function Answer(props: AnswerPropsUnion<QuestionType>) {
  switch (props.type) {
    case "shortText":
      return <AnswerShortText {...props} />;
    case "longText":
      return <AnswerLongText {...props} />;
    case "number":
      return <AnswerNumber {...props} />;
    case "email":
      return <AnswerEmail {...props} />;
    case "date":
      return <AnswerDate {...props} />;
    case "statement":
      return <AnswerStatement {...props} />;
    case "website":
      return <AnswerWebsite {...props} />;
    case "yesNo":
      return <AnswerYesNo {...props} />;
    case "phoneNumber":
      return <AnswerPhoneNumber {...props} />;
    case "dropdown":
      return <AnswerDropdown {...props} />;
    case "multipleChoice":
      return <AnswerMultipleChoice {...props} />;
    case "contactInfo":
      return <AnswerContactInfo {...props} />;
    case "ranking":
      return <AnswerRanking {...props} />;
    case "rating":
      return <AnswerRating {...props} />;
    case "address":
      return <AnswerAddress {...props} />;
  }

  return <div className="col-start-2 mt-8">🥲 Not implemented!</div>;
}

import { QuestionType } from "server/routers/question/question.schemas";
import { AnswerProps } from "./AnswerProps";

import AnswerShortText from "./AnswerShortText";
import AnswerLongText from "./AnswerLongText";
import AnswerEmail from "./AnswerEmail";
import AnswerNumber from "./AnswerNumber";
import AnswerDate from "./AnswerDate";
import AnswerStatement from "./AnswerStatement";
import AnswerWebsite from "./AnswerWebsite";
import AnswerYesNo from "./AnswerYesNo";
import AnswerPhoneNumber from "./AnswerPhoneNumber";
import AnswerDropdown from "./AnswerDropdown";
import AnswerMultipleChoice from "./AnswerMultipleChoice";
import AnswerContactInfo from "./AnswerContactInfo";
import AnswerRanking from "./AnswerRanking";
import AnswerRating from "./AnswerRating";
import AnswerAddress from "./AnswerAddress";
import AnswerOpinionScale from "./AnswerOpinionScale";
import AnswerLegal from "./AnswerLegal";
import AnswerMatrix from "./AnswerMatrix";

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
    case "opinionScale":
      return <AnswerOpinionScale {...props} />;
    case "legal":
      return <AnswerLegal {...props} />;
    case "matrix":
      return <AnswerMatrix {...props} />;
  }

  return <div className="col-start-2 mt-8">🥲 Not implemented!</div>;
}

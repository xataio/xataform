import { Question } from "server/routers/question/question.schemas";

import SettingsMultipleChoice from "./SettingsMultipleChoice";
import SettingsContactInfo from "./SettingsContactInfo";
import SettingsAddress from "./SettingsAddress";
import SettingsPhoneNumber from "./SettingsPhoneNumber";
import SettingsShortText from "./SettingsShortText";
import SettingsLongText from "./SettingsLongText";
import SettingsStatement from "./SettingsStatement";
import SettingsRanking from "./SettingsRanking";
import SettingsYesNo from "./SettingsYesNo";
import SettingsEmail from "./SettingsEmail";
import SettingsOpinionScale from "./SettingsOpinionScale";
import SettingsRating from "./SettingsRating";
import SettingsMatrix from "./SettingsMatrix";
import SettingsDate from "./SettingsDate";
import SettingsNumber from "./SettingsNumber";
import SettingsDropdown from "./SettingsDropdown";
import SettingsLegal from "./SettingsLegal";
import SettingsWebsite from "./SettingsWebsite";

export function QuestionSettings(
  question: Question & { questionId: string; formId: string }
) {
  switch (question.type) {
    case "multipleChoice":
      return <SettingsMultipleChoice {...question} />;
    case "contactInfo":
      return <SettingsContactInfo {...question} />;
    case "address":
      return <SettingsAddress {...question} />;
    case "phoneNumber":
      return <SettingsPhoneNumber {...question} />;
    case "shortText":
      return <SettingsShortText {...question} />;
    case "longText":
      return <SettingsLongText {...question} />;
    case "statement":
      return <SettingsStatement {...question} />;
    case "ranking":
      return <SettingsRanking {...question} />;
    case "yesNo":
      return <SettingsYesNo {...question} />;
    case "email":
      return <SettingsEmail {...question} />;
    case "opinionScale":
      return <SettingsOpinionScale {...question} />;
    case "rating":
      return <SettingsRating {...question} />;
    case "matrix":
      return <SettingsMatrix {...question} />;
    case "date":
      return <SettingsDate {...question} />;
    case "number":
      return <SettingsNumber {...question} />;
    case "dropdown":
      return <SettingsDropdown {...question} />;
    case "legal":
      return <SettingsLegal {...question} />;
    case "website":
      return <SettingsWebsite {...question} />;
  }
}

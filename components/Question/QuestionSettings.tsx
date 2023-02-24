import dynamic from "next/dynamic";
import { Spinner } from "components/Spinner";
import { Question } from "server/routers/question/question.schemas";

const SettingsMultipleChoice = dynamic(
  () => import("./SettingsMultipleChoice"),
  {
    loading: Spinner,
  }
);
const SettingsContactInfo = dynamic(() => import("./SettingsContactInfo"), {
  loading: Spinner,
});
const SettingsAddress = dynamic(() => import("./SettingsAddress"), {
  loading: Spinner,
});
const SettingsPhoneNumber = dynamic(() => import("./SettingsPhoneNumber"), {
  loading: Spinner,
});
const SettingsShortText = dynamic(() => import("./SettingsShortText"), {
  loading: Spinner,
});
const SettingsLongText = dynamic(() => import("./SettingsLongText"), {
  loading: Spinner,
});
const SettingsStatement = dynamic(() => import("./SettingsStatement"), {
  loading: Spinner,
});
const SettingsRanking = dynamic(() => import("./SettingsRanking"), {
  loading: Spinner,
});
const SettingsYesNo = dynamic(() => import("./SettingsYesNo"), {
  loading: Spinner,
});
const SettingsEmail = dynamic(() => import("./SettingsEmail"), {
  loading: Spinner,
});
const SettingsOpinionScale = dynamic(() => import("./SettingsOpinionScale"), {
  loading: Spinner,
});
const SettingsRating = dynamic(() => import("./SettingsRating"), {
  loading: Spinner,
});
const SettingsMatrix = dynamic(() => import("./SettingsMatrix"), {
  loading: Spinner,
});
const SettingsDate = dynamic(() => import("./SettingsDate"), {
  loading: Spinner,
});
const SettingsNumber = dynamic(() => import("./SettingsNumber"), {
  loading: Spinner,
});
const SettingsDropdown = dynamic(() => import("./SettingsDropdown"), {
  loading: Spinner,
});
const SettingsLegal = dynamic(() => import("./SettingsLegal"), {
  loading: Spinner,
});
const SettingsWebsite = dynamic(() => import("./SettingsWebsite"), {
  loading: Spinner,
});

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

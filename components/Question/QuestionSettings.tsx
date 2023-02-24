import dynamic from "next/dynamic";
import { Spinner } from "components/Spinner";
import { Question } from "server/routers/question/question.schemas";

const SettingsMultipleChoice = dynamic(
  () => import("./SettingsMultipleChoice"),
  {
    loading: Spinner,
  }
);

export function QuestionSettings(
  question: Question & { questionId: string; formId: string }
) {
  switch (question.type) {
    case "multipleChoice":
      return <SettingsMultipleChoice {...question} />;
  }

  return <div>Not implemented</div>;
}

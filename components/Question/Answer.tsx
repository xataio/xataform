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

// Transforms `AnswerProps<T>` to `AnswerProps<"shortText"> | AnswerProps<"longText"> | …`
// This is to enable proper type narrowing in our component switch cases
type AnswerPropsUnion<T> = T extends QuestionType ? AnswerProps<T> : never;

export function Answer(props: AnswerPropsUnion<QuestionType>) {
  switch (props.type) {
    case "shortText":
      return <AnswerShortText {...props} />;
    case "longText":
      return <AnswerLongText {...props} />;
  }

  return <div>Not implemented!</div>;
}

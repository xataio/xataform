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
  }

  return <div>Not implemented!</div>;
}

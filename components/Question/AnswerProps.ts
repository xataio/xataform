import {
  QuestionOfType,
  QuestionType,
} from "server/routers/question/question.schemas";

export type AnswerProps<T extends QuestionType> =
  | EditingAnswerProps<T>
  | SubmitAnswerProps<T>;

export type AnswerLayout = "split" | "full";

type CommonProps<T extends QuestionType> = QuestionOfType<T> & {
  layout: AnswerLayout;
  questionId: string;
  formId: string;
};

type EditingAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: true;
};

type SubmitAnswerProps<T extends QuestionType> = CommonProps<T> & {
  admin: false;
  onSubmit: (answer: AnswerType<T>) => void;
};

type AnswerType<T extends QuestionType> = {
  multipleChoice: string[];
  contactInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    company: string;
  };
  address: {
    address: string;
    address2: string;
    cityTown: string;
    stateRegionProvince: string;
    zipCode: string;
    country: string;
  };
  phoneNumber: string;
  shortText: string;
  longText: string;
  statement: null;
  ranking: string[];
  yesNo: boolean;
  email: string;
  opinionScale: number;
  rating: number;
  matrix: Record<string, string[] | string>;
  date: string;
  number: number;
  dropdown: string;
  legal: boolean;
  website: string;
}[T];

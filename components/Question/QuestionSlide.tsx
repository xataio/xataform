import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ErrorMessage } from "components/ErrorMessage";
import { Spinner } from "components/Spinner";
import { useGetQuestion } from "hooks/useGetQuestion";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import Image from "next/image";
import { KeyboardEvent, useEffect, useState } from "react";
import { Answer } from "./Answer";

export type QuestionSlideProps = {
  formId: string;
  questionId: string;
  isLastQuestion: boolean;
};

export function QuestionSlide({
  formId,
  questionId,
  isLastQuestion,
}: QuestionSlideProps) {
  const { updateQuestion } = useUpdateQuestion({ formId });
  const { question, isLoading, error } = useGetQuestion({ formId, questionId });

  const [draft, setDraft] = useState(question!);
  useEffect(() => {
    if (question)
      setDraft((prev) => ({
        ...question,
        title: prev?.title ?? question.title,
        description: prev?.description ?? question.description,
      }));
  }, [question]);

  const onBlur = () =>
    updateQuestion({ questionId: questionId, question: draft });
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    // Undo
    if (e.key === "Escape" && question) {
      setDraft(question);
    }
    // Validate the input
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  if (isLoading || !question || !draft) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  return (
    <div
      className={clsx(
        "h-full items-center",
        question.illustration ? "grid grid-cols-2" : "flex justify-center"
      )}
    >
      <div
        className={clsx(
          "grid grid-cols-header p-10",
          !question.illustration && "w-full p-28"
        )}
      >
        {/* Question number */}
        <div className="text mr-2 flex flex-row items-center gap-1 text-indigo-600">
          {question.order + 1}
          <ArrowRightIcon className="h-4 w-4" />
        </div>

        {/* Title */}
        <div className="relative">
          <input
            required={"required" in question && question.required}
            aria-label="title"
            type="text"
            className={clsx(
              "border-0 text-xl placeholder:font-light placeholder:italic placeholder:text-slate-300 focus:ring-0"
            )}
            placeholder={
              "Your question here." +
              ("required" in question && question.required ? " *" : "")
            }
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, title: e.target.value }))
            }
            value={draft.title}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
          />
          {"required" in question && question.required && draft.title ? (
            <div
              className={`pointer-events-none absolute left-0 top-0 py-2 px-3 text-xl text-red-600`}
              aria-hidden="true"
            >
              <span className="mr-1 text-transparent">{draft.title}</span>
              <span>*</span>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <input
          className={clsx(
            "col-start-2 mt-1",
            "font-light outline-none",
            "placeholder:italic",
            "border-0",
            "focus:ring-0"
          )}
          aria-label="description"
          placeholder="Description (optional)"
          type="text"
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, description: e.target.value }))
          }
          value={draft.description || ""}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
        />

        <Answer
          {...question}
          questionId={questionId}
          formId={formId}
          layout={question.illustration ? "split" : "full"}
          isLastQuestion={isLastQuestion}
          admin
        />
      </div>

      {/* Illustation */}
      {question.illustration ? (
        <div className="relative h-full border">
          <Image
            fill
            className="object-cover"
            alt="todo"
            src={question.illustration}
          />
        </div>
      ) : null}
    </div>
  );
}

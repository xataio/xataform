import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ErrorMessage } from "components/ErrorMessage";
import { Spinner } from "components/Spinner";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";

export type QuestionSlideProps = {
  formId: string;
  questionId: string;
};

export function QuestionSlide({ formId, questionId }: QuestionSlideProps) {
  const { updateQuestion } = useUpdateQuestion({ formId });
  const { data, isLoading, error } = trpc.question.get.useQuery(
    { questionId },
    {
      enabled: Boolean(questionId),
    }
  );

  const [draft, setDraft] = useState(data!);
  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const onBlur = () => updateQuestion({ id: questionId, question: draft });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage>{error.message}</ErrorMessage>;
  }

  if (!data || !draft) {
    return <ErrorMessage>Not found!</ErrorMessage>;
  }

  return (
    <div className="grid h-full grid-cols-2 items-center">
      <div className="grid grid-cols-header p-10">
        {/* Question number */}
        <div className="mr-2 flex flex-row items-center gap-1 text-xs text-indigo-600">
          {data.order + 1}
          <ArrowRightIcon className="h-2 w-2" />
        </div>

        {/* Title */}
        <input
          aria-label="title"
          type="text"
          className="outline-none"
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, title: e.target.value }))
          }
          value={draft.title}
          onBlur={onBlur}
        />

        {/* Description */}
        <input
          className={clsx(
            "col-start-2",
            "text-sm font-light outline-none",
            "placeholder:italic"
          )}
          aria-label="description"
          placeholder="Description (optional)"
          type="text"
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, description: e.target.value }))
          }
          value={draft.description || ""}
          onBlur={onBlur}
        />

        {/* Answer */}
        <input
          type="text"
          disabled
          className=" col-start-2 mt-8  w-fit border-b border-indigo-200 bg-white pb-0.5 placeholder:text-indigo-200"
          placeholder="Type your answer here…"
        />
      </div>

      {/* Illustation */}
      <div className="relative h-full border">
        <Image
          fill
          className="object-cover"
          alt="todo"
          src="https://images.unsplash.com/photo-1599631438215-75bc2640feb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"
        />
      </div>
    </div>
  );
}

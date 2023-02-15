import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ErrorMessage } from "components/ErrorMessage";
import { Spinner } from "components/Spinner";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import Image from "next/image";
import {
  KeyboardEvent,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import { trpc } from "utils/trpc";
import { Answer } from "./Answer";

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
    if (data)
      setDraft((prev) => ({
        ...data,
        title: prev?.title ?? data.title,
        description: prev?.description ?? data.description,
      }));
  }, [data]);

  const onBlur = () => updateQuestion({ id: questionId, question: draft });
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    // Undo
    if (e.key === "Escape" && data) {
      setDraft(data);
    }
    // Validate the input
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

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
    <div
      className={clsx(
        "h-full items-center",
        data.illustration ? "grid grid-cols-2" : "flex justify-center"
      )}
    >
      <div
        className={clsx(
          "grid grid-cols-header p-10",
          !data.illustration && "w-full p-28"
        )}
      >
        {/* Question number */}
        <div className="text mr-2 flex flex-row items-center gap-1 text-indigo-600">
          {data.order + 1}
          <ArrowRightIcon className="h-4 w-4" />
        </div>

        {/* Title */}
        <input
          aria-label="title"
          type="text"
          className="text-xl outline-none placeholder:font-light placeholder:italic placeholder:text-slate-300"
          placeholder="Your question here."
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, title: e.target.value }))
          }
          value={draft.title}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
        />

        {/* Description */}
        <input
          className={clsx(
            "col-start-2 mt-1",
            "font-light outline-none",
            "placeholder:italic"
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
          type={data.type}
          layout={data.illustration ? "split" : "full"}
          editable
          onUpdate={console.log}
        />
      </div>

      {/* Illustation */}
      {data.illustration ? (
        <div className="relative h-full border">
          <Image
            fill
            className="object-cover"
            alt="todo"
            src={data.illustration}
          />
        </div>
      ) : null}
    </div>
  );
}

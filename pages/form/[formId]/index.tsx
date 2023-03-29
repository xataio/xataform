import { ArrowRightIcon } from "@heroicons/react/20/solid";
import slugify from "slugify";
import clsx from "clsx";
import { Answer } from "components/Question/Answer";
import {
  InferGetStaticPropsType,
  GetStaticPropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from "next";
import Image from "next/image";
import { RoutedQuery } from "nextjs-routes";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { database } from "server/services/database";
import { trpc } from "utils/trpc";

export async function getStaticPaths() {
  const publishedForms = await database.listPublishedForms();

  return {
    paths: publishedForms.map((d) => ({
      params: {
        formId: d.id,
      },
    })),
    fallback: "blocking",
  } satisfies GetStaticPathsResult<RoutedQuery<"/form/[formId]">>;
}

export async function getStaticProps(
  context: GetStaticPropsContext<RoutedQuery<"/form/[formId]">>
) {
  const formId = context.params?.formId ?? "unknown";
  const { questions, version } = await database.listPublishedQuestions({
    formId,
  });

  const ending = await database.getEnding({ formId });

  if (questions.length === 0) {
    return {
      notFound: true,
    } satisfies GetStaticPropsResult<any>;
  }

  return {
    props: { questions, formId, version, ending },
  } satisfies GetStaticPropsResult<any>;
}

export default function Form(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const $questions = useRef<HTMLDivElement>(null);
  const [slideNumber, setSlideNumber] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const { mutate: submit } = trpc.form.submitFormAnswer.useMutation({
    onError(err) {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    // Focus the first element of the current slide if the focus is away
    if (!$questions.current) return;
    const $forms = $questions.current.querySelectorAll("form");
    const $currentSlide = $forms[slideNumber - 1];
    if (!$currentSlide || $currentSlide.contains(document.activeElement)) {
      return;
    }
    const $element = $currentSlide.querySelector(
      "input, [tabindex], [role=radio], [role=checkbox]"
    );
    if ($element instanceof HTMLElement) {
      requestAnimationFrame(() => $element.focus());
    }
  }, [slideNumber, $questions]);

  return (
    <div className="h-screen overflow-hidden" ref={$questions}>
      {/* Questions */}
      {props.questions.map((question, i) => (
        <div
          key={question.questionId}
          style={{ top: `calc(100vh * -${slideNumber - 1})` }}
          className={clsx(
            "relative transition-all duration-700",
            "h-screen items-center",
            "bg-slate-50",
            i + 1 !== slideNumber && "pointer-events-none select-none",
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
              <h1>
                {question.title}
                {"required" in question && question.required ? (
                  <span className="pl-1 font-bold text-red-600">*</span>
                ) : null}
              </h1>
            </div>

            {/* Description */}
            <p>{question.description}</p>

            <Answer
              {...question}
              onFocus={() => {
                if (hasSubmitted) return;

                // Prevent focusing something out of the screen
                setSlideNumber(question.order + 1);
                if ($questions.current) {
                  $questions.current.scroll({
                    top: 0,
                  });
                }
              }}
              layout={question.illustration ? "split" : "full"}
              isLastQuestion={i === props.questions.length - 1}
              admin={false}
              onSubmit={async (val: any) => {
                if (hasSubmitted) return;

                if (question.type !== "statement") {
                  setAnswers((prev) => ({
                    ...prev,
                    [question.order +
                    "-" +
                    slugify(question.title, {
                      lower: true,
                      strict: true,
                      trim: true,
                    })]: val,
                  }));
                }

                if (i === props.questions.length - 1) {
                  // Check if every required question are filled
                  for (const q of props.questions) {
                    if ("required" in q && q.required) {
                      const key =
                        q.order +
                        "-" +
                        slugify(q.title, {
                          lower: true,
                          strict: true,
                          trim: true,
                        });
                      if (answers[key] === null || answers[key] === undefined) {
                        setSlideNumber(q.order + 1);
                        return;
                      }
                    }
                  }

                  // Submit the form
                  submit({
                    formId: props.formId,
                    version: props.version,
                    payload: {
                      ...answers,
                      [question.order +
                      "-" +
                      slugify(question.title, {
                        lower: true,
                        strict: true,
                        trim: true,
                      })]: val,
                    },
                  });
                  setHasSubmitted(true);
                }

                setSlideNumber((i) => i + 1);
              }}
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
      ))}
      {/* Ending */}
      <div
        style={{ top: `calc(100vh * -${slideNumber - 1})` }}
        className={clsx(
          "relative transition-all duration-700",
          "h-screen",
          "flex flex-col items-center justify-center gap-4",
          "bg-indigo-50"
        )}
      >
        <h1 className="text-6xl text-indigo-600">{props.ending.title}</h1>
        {props.ending.subtitle ? (
          <h2 className="text-lg font-light text-indigo-500">
            {props.ending.subtitle}
          </h2>
        ) : null}
      </div>
      {/* Slide number */}
      {slideNumber <= props.questions.length ? (
        <>
          <div
            className={clsx(
              "absolute bottom-3 -translate-x-full text-sm text-indigo-600",
              "transition-all duration-200"
            )}
            style={{
              left: `calc(${(slideNumber / props.questions.length) * 100}vw)`,
            }}
          >
            {slideNumber}/{props.questions.length}
          </div>
          <div
            className="absolute bottom-0 h-2 bg-indigo-600 transition-all duration-200"
            style={{
              width: `calc(${(slideNumber / props.questions.length) * 100}vw)`,
            }}
          />
        </>
      ) : null}
    </div>
  );
}

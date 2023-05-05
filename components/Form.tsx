import { ArrowRightIcon } from "@heroicons/react/20/solid";
import slugify from "slugify";
import clsx from "clsx";
import { Answer } from "components/Question/Answer";
import Image from "next/image";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { database } from "server/services/database";
export type FormProps = {
  questions: Awaited<
    ReturnType<(typeof database)["listPublishedQuestions"]>
  >["questions"];
  ending: Awaited<ReturnType<(typeof database)["getEnding"]>>;
  onSubmit: (answers: Record<string, any>) => void;
};
export function Form({ questions, onSubmit, ending }: FormProps) {
  const $questions = useRef<HTMLDivElement>(null);
  const [slideNumber, setSlideNumber] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

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
      $element.focus();
    }
  }, [slideNumber, $questions]);

  return (
    <div className="h-screen overflow-hidden" ref={$questions}>
      {/* Questions */}
      {questions.map((question, i) => (
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
              !question.illustration && "w-full sm:p-28"
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
            <p className="col-start-2 mt-1 font-light">
              {question.description}
            </p>

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
              isLastQuestion={i === questions.length - 1}
              admin={false}
              onSubmit={async (val: any) => {
                if (
                  document.activeElement &&
                  "blur" in document.activeElement &&
                  typeof document.activeElement.blur === "function"
                ) {
                  document.activeElement?.blur();
                }

                if (hasSubmitted || isSubmitting) return;

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

                if (i === questions.length - 1) {
                  // Check if every required question are filled
                  for (const q of questions) {
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
                  onSubmit({
                    ...answers,
                    [question.order +
                    "-" +
                    slugify(question.title, {
                      lower: true,
                      strict: true,
                      trim: true,
                    })]: val,
                  });
                  setHasSubmitted(true);
                }

                // Wait a bit to show the answer and avoid bruteforcing the form
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  setSlideNumber((i) => {
                    return i + 1;
                  });
                }, 500);
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
          "h-screen w-screen text-center",
          "flex flex-col items-center justify-center gap-4",
          "bg-indigo-50"
        )}
      >
        <h1 className="text-6xl text-indigo-600">{ending.title}</h1>
        {ending.subtitle ? (
          <h2 className="text-lg font-light text-indigo-500">
            {ending.subtitle}
          </h2>
        ) : null}
      </div>
      {/* Slide number */}
      {slideNumber <= questions.length ? (
        <>
          <div
            className={clsx(
              "absolute bottom-3 px-1 text-sm text-indigo-600",
              "transition-all duration-200",
              slideNumber > questions.length / 2
                ? "-translate-x-full"
                : "-translate-x-1/2"
            )}
            style={{
              left: `calc(${(slideNumber / questions.length) * 100}vw)`,
            }}
          >
            {slideNumber}/{questions.length}
          </div>
          <div
            className="absolute bottom-0 h-2 bg-indigo-600 transition-all duration-200"
            style={{
              width: `calc(${(slideNumber / questions.length) * 100}vw)`,
            }}
          />
        </>
      ) : null}
    </div>
  );
}

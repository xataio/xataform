import clsx from "clsx";
import { Button } from "components/Button";
import Ending from "components/Question/Ending";
import { QuestionSlide } from "components/Question/QuestionSlide";
import { Settings } from "components/Question/Settings";
import { useAddMockQuestions } from "hooks/useAddMockQuestions";
import { useFormSummary } from "hooks/useFormSummary";
import { useToggle } from "hooks/useToggle";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { trpc } from "utils/trpc";
import { ContentPanel } from "./ContentPanel";

export type CreateFormMainProps = {
  formId: string;
};

export function CreateFormMain({ formId }: CreateFormMainProps) {
  const { addMockQuestions } = useAddMockQuestions();
  const { questions } = useFormSummary({ formId });
  const { data: ending } = trpc.ending.get.useQuery({ formId });

  // Panels control
  const [isContentPanelOpen, toggleContentPanelOpen] = useToggle(true);
  const [isQuestionPanelOpen, toggleQuestionPanelOpen] = useToggle(true);

  const slideContainerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Adjust the slide to the available space
  useLayoutEffect(() => {
    if (!slideContainerRef.current || !slideRef.current) return;

    const container = slideContainerRef.current;
    const slide = slideRef.current;

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      const scaleWidth = width / 1024;
      const scaleHeight = (height - 50) / 512; // Margin to not hit the bottom controls
      const scale = Math.min(scaleHeight, scaleWidth, 1);
      slide.style.transform = `scale(${scale})`;
    });
    resizeObserver.observe(container);

    return () => resizeObserver.unobserve(container);
  }, [slideContainerRef, slideRef]);

  // Sync url with questionId
  const router = useRouter();
  useEffect(() => {
    if (!questions || questions.length < 1) return;
    if (questions[0].id === "placeholder") return;

    const questionId =
      typeof router.query.questionId === "string"
        ? router.query.questionId
        : null;

    const isValidQuestionId =
      questionId === "ending" ||
      Boolean(questions.find((i) => i.id === questionId));

    if (!isValidQuestionId) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, questionId: questions[0].id },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [questions, router]);

  return (
    <div className="flex h-full justify-between overflow-hidden">
      <Panel isOpen={isContentPanelOpen}>
        <ContentPanel
          formId={formId}
          questions={questions || []}
          ending={
            ending || { title: "Loading…", subtitle: null, id: "loading" }
          }
        />
      </Panel>
      <section className="flex w-full flex-col overflow-hidden border-x border-slate-200 bg-slate-100 p-4">
        <div
          className="flex h-full items-center justify-center"
          ref={slideContainerRef}
        >
          <div
            className="absolute h-[512px] w-[1024px] overflow-hidden rounded-md bg-white shadow"
            ref={slideRef}
          >
            {typeof router.query.questionId === "string" &&
            router.query.questionId.startsWith("rec_") ? (
              <QuestionSlide
                key={router.query.questionId}
                questionId={router.query.questionId}
                formId={formId}
                isLastQuestion={
                  router.query.questionId ===
                  (questions?.at(-1) ?? { id: "" }).id
                }
              />
            ) : null}
            {router.query.questionId === "ending" ? (
              <Ending formId={formId} />
            ) : null}
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            icon={isContentPanelOpen ? "sidebar-left" : "sidebar-right"}
            onClick={toggleContentPanelOpen}
            iconOnly
            variant="secondary"
          >
            {isContentPanelOpen ? "Close sidebar" : "Open sidebar"}
          </Button>
          <div className="flex-raw flex items-center gap-2">
            {process.env.NODE_ENV === "development" ? (
              <div
                className="cursor-pointer text-sm text-slate-400 underline"
                onClick={() => addMockQuestions({ formId })}
              >
                Add mock questions
              </div>
            ) : null}
            {typeof router.query.questionId === "string" &&
            router.query.questionId.startsWith("rec_") ? (
              <Button
                icon={isQuestionPanelOpen ? "sidebar-right" : "sidebar-left"}
                onClick={toggleQuestionPanelOpen}
                iconOnly
                variant="secondary"
              >
                {isQuestionPanelOpen ? "Close sidebar" : "Open sidebar"}
              </Button>
            ) : null}
          </div>
        </div>
      </section>
      {typeof router.query.questionId === "string" &&
      router.query.questionId.startsWith("rec_") ? (
        <Panel isOpen={isQuestionPanelOpen}>
          <Settings formId={formId} questionId={router.query.questionId} />
        </Panel>
      ) : null}
    </div>
  );
}

function Panel({
  children,
  isOpen,
}: React.PropsWithChildren<{ isOpen: boolean }>) {
  return (
    <section
      className={clsx(
        isOpen ? "w-64 min-w-[16rem]" : "w-0",
        "z-10 flex h-full flex-col shadow-lg transition-all overflow-x-hidden"
      )}
    >
      {children}
    </section>
  );
}

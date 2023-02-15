import clsx from "clsx";
import { Button } from "components/Button";
import { QuestionSlide } from "components/Question/QuestionSlide";
import { useAddMockQuestions } from "hooks/useAddMockQuestions";
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
  const { data: questions, error } = trpc.form.summary.useQuery(
    { formId },
    {
      placeholderData: [
        {
          id: "placeholder",
          description: null,
          illustration: null,
          order: 0,
          title: "Loading…",
          type: "shortText",
        },
      ],
    }
  );

  // Panels control
  const [isContentPanelOpen, toggleContentPanelOpen] = useToggle(true);
  const [isQuestionPanelOpen, toggleQuestionPanelOpen] = useToggle(false);

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

    const isValidQuestionId = Boolean(
      questions.find((i) => i.id === questionId)
    );

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
        <ContentPanel formId={formId} questions={questions || []} />
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
            {typeof router.query.questionId === "string" ? (
              <QuestionSlide
                key={router.query.questionId}
                questionId={router.query.questionId}
                formId={formId}
              />
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
            <Button
              icon={isQuestionPanelOpen ? "sidebar-right" : "sidebar-left"}
              onClick={toggleQuestionPanelOpen}
              iconOnly
              variant="secondary"
            >
              {isQuestionPanelOpen ? "Close sidebar" : "Open sidebar"}
            </Button>
          </div>
        </div>
      </section>
      <Panel isOpen={isQuestionPanelOpen}>question</Panel>
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

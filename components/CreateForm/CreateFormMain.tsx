import clsx from "clsx";
import { Button } from "components/Button";
import { useToggle } from "hooks/useToggle";
import React, { useRef } from "react";
import { useLayoutEffect } from "react";

export function CreateFormMain() {
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
      const scale = Math.min(scaleHeight, scaleWidth);
      slide.style.transform = `scale(${scale})`;
    });
    resizeObserver.observe(container);

    return () => resizeObserver.unobserve(container);
  }, [slideContainerRef]);

  return (
    <div className="flex h-full justify-between">
      <Panel isOpen={isContentPanelOpen}>content</Panel>
      <div className="flex w-full flex-col overflow-hidden border-x border-slate-200 bg-slate-100 p-4">
        <div
          className="flex h-full items-center justify-center"
          ref={slideContainerRef}
        >
          <div
            className="absolute h-[512px] w-[1024px] rounded-md bg-white p-4 shadow"
            ref={slideRef}
          >
            Question
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
      <Panel isOpen={isQuestionPanelOpen}>question</Panel>
    </div>
  );
}

function Panel({
  children,
  isOpen,
}: React.PropsWithChildren<{ isOpen: boolean }>) {
  return (
    <div
      className={clsx(
        isOpen ? "w-64" : "w-0",
        "z-10  shadow-lg transition-all overflow-x-hidden"
      )}
    >
      {children}
    </div>
  );
}

import clsx from "clsx";
import { Button } from "components/Button";
import { useToggle } from "hooks/useToggle";
import React from "react";

export function CreateFormMain() {
  const [isContentPanelOpen, toggleContentPanelOpen] = useToggle(true);
  const [isQuestionPanelOpen, toggleQuestionPanelOpen] = useToggle(true);

  return (
    <div className="flex h-full justify-between">
      <Panel isOpen={isContentPanelOpen}>content</Panel>
      <div className="flex w-full flex-col border-x border-slate-200 bg-slate-100 p-4">
        <div className="h-full">slide</div>
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

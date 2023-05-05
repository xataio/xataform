import { Panel } from "components/Panel";
import { EditLogicPanel } from "./EditLogicPanel";
import { LogicFlow } from "./LogicFlow";
import { useEffect, useState } from "react";
import { RouterOutputs } from "utils/trpc";
import { useFormSummary } from "hooks/useFormSummary";

export type FormLogicMainProps = {
  formId: string;
};

export function FormLogicMain({ formId }: FormLogicMainProps) {
  const [selectedQuestion, setSelectedQuestion] =
    useState<RouterOutputs["form"]["summary"][number]>();

  return (
    <div className="flex h-full justify-between overflow-hidden">
      <Panel isOpen>
        <EditLogicPanel formId={formId} question={selectedQuestion} />
      </Panel>

      <section className="h-full w-full overflow-hidden border-x border-slate-200 bg-slate-100 p-4">
        <LogicFlow formId={formId} onNodeSelection={setSelectedQuestion} />
      </section>
    </div>
  );
}

import clsx from "clsx";
import { Button } from "components/Button";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { questionSchema } from "server/routers/question/question.schemas";

export function ContentPanel() {
  return (
    <>
      <header className="flex items-center justify-between p-2 text-sm font-medium">
        <h1>Content</h1>
        <Button icon="add" iconOnly tooltipPlacement="bottom-start">
          Add a new question
        </Button>
      </header>
      <div
        className={clsx(
          "overflow-y-auto",
          "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded"
        )}
      >
        {Array.from(questionSchema.optionsMap.keys()).map((i, index) => (
          <div
            className="flex flex-row items-center gap-4 px-2 py-4 hover:bg-indigo-50"
            key={index}
          >
            <QuestionIcon type={i} order={index + 1} />
            <h2 className="truncate text-sm">Question title ({i})</h2>
          </div>
        ))}
      </div>
    </>
  );
}

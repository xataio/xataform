import clsx from "clsx";
import { Button } from "components/Button";

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
        {new Array(100).fill(0).map((_i, index) => (
          <div
            className="flex flex-row items-center gap-4 px-2 py-4 hover:bg-indigo-50"
            key={index}
          >
            <div className="rounded bg-blue-600 px-2 text-center text-white">
              {index + 1}
            </div>
            <h2 className="truncate text-sm">Question title</h2>
          </div>
        ))}
      </div>
    </>
  );
}

import { useEffect } from "react";
import { useState } from "react";

export type InlineEditTitleProps = {
  title: string;
  onSubmit: (nextTitle: string) => void;
};

export function InlineEditTitle({ title, onSubmit }: InlineEditTitleProps) {
  const [draftTitle, setDraftTitle] = useState(title);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  return (
    <div className="flex items-center gap-1 text-indigo-300">
      /
      <input
        type="text"
        className="rounded border-2 border-transparent bg-transparent p-1 text-sm selection:bg-indigo-700 focus:border-indigo-400 focus:bg-indigo-500 focus:text-white focus:outline-none hover:border-indigo-400 hover:bg-indigo-500 hover:text-white"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.currentTarget.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        onBlur={() => {
          if (draftTitle.trim() === "") {
            setDraftTitle(title);
            return;
          }
          onSubmit(draftTitle);
        }}
      />
    </div>
  );
}

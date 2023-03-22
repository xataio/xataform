import clsx from "clsx";
import { useUpdateEnding } from "hooks/useUpdateEnding";
import { KeyboardEvent, useEffect, useState } from "react";
import { trpc } from "utils/trpc";

function Ending({ formId }: { formId: string }) {
  const { data } = trpc.ending.get.useQuery({ formId });
  const { updateEnding } = useUpdateEnding();
  const [draft, setDraft] = useState({ title: "", subtitle: "" });

  useEffect(() => {
    if (data) setDraft({ title: data.title, subtitle: data.subtitle || "" });
  }, [data]);

  const onBlur = () => {
    if (!data) return;
    updateEnding({ ...draft, endingId: data.id, formId });
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    // Undo
    if (e.key === "Escape" && data) {
      setDraft({ title: data.title, subtitle: data.subtitle || "" });
    }
    // Validate the input
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <input
        type="text"
        className={clsx(
          "outline-none",
          "placeholder:italic",
          "m-0 border-0 p-0",
          "focus:ring-0",
          "text-center text-6xl text-indigo-600"
        )}
        placeholder="Thanks you!"
        value={draft.title}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, title: e.target.value }))
        }
        onKeyUp={onKeyUp}
        onBlur={onBlur}
      />
      <input
        type="text"
        className={clsx(
          "m-0 border-0 p-0 placeholder:font-light placeholder:italic placeholder:text-slate-300 focus:ring-0",
          "text-center text-lg font-light text-indigo-500"
        )}
        value={draft.subtitle || ""}
        placeholder="Subtitle (optional)"
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, subtitle: e.target.value }))
        }
        onKeyUp={onKeyUp}
        onBlur={onBlur}
      />
    </div>
  );
}

export default Ending;

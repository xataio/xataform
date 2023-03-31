import { Button } from "components/Button";
import { Form } from "components/Form";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "utils/trpc";

export default function PreviewPage() {
  const {
    query: { formId },
  } = useRouter();
  if (typeof formId !== "string") throw new Error("FormId not valid");

  const { data } = trpc.form.preview.useQuery({ formId });
  const [key, setKey] = useState(0);

  if (!data) {
    return null;
  }

  return (
    <div>
      <Form
        key={key}
        questions={data.questions}
        ending={data.ending}
        onSubmit={console.log}
      />
      <div className="absolute top-2 right-2 flex items-center gap-4 rounded-md border border-slate-300 bg-slate-200 py-2 px-4">
        <h2 className="text-slate-600">Preview mode</h2>
        <Button icon="reset" onClick={() => setKey((i) => (i + 1) % 10)}>
          Reset
        </Button>
      </div>
    </div>
  );
}

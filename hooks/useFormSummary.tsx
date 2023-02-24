import { toast } from "react-toastify";
import { questionSchema } from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";

export function useFormSummary({ formId }: { formId: string }) {
  const utils = trpc.useContext();

  const { data: questions, ...rest } = trpc.form.summary.useQuery(
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
      onSuccess(data) {
        data.forEach((question) => {
          const prev = utils.question.get.getData({ questionId: question.id });
          if (prev) return;
          try {
            const questionWithDefaults = questionSchema.parse(question);
            utils.question.get.setData(
              { questionId: question.id },
              { id: question.id, ...questionWithDefaults }
            );
          } catch (e) {
            console.error(
              `Question ${question.id} can't be populate to the cache`,
              e
            );
          }
        });
      },
      onError(err) {
        toast.error(err.message);
      },
    }
  );

  return {
    questions,
    ...rest,
  };
}

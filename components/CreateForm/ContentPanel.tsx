import clsx from "clsx";
import { Button } from "components/Button";
import { ErrorMessage } from "components/ErrorMessage";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { useReorderQuestions } from "hooks/useReorderQuestions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  QuestionCommunProps,
  QuestionType,
} from "server/routers/question/question.schemas";
import { trpc } from "utils/trpc";

export type ContentPanelProps = {
  formId: string;
};

export function ContentPanel({ formId }: ContentPanelProps) {
  const { reorderQuestions } = useReorderQuestions();

  const { data: questions, error } = trpc.form.summary.useQuery(
    { formId },
    {
      placeholderData: [
        {
          id: "",
          description: null,
          illustration: null,
          order: 0,
          title: "Loading…",
          type: "shortText",
        },
      ],
    }
  );

  return (
    <>
      <header className="flex items-center justify-between p-2 text-sm font-medium">
        <h1>Content</h1>
        <Button icon="add" iconOnly tooltipPlacement="bottom-start">
          Add a new question
        </Button>
      </header>
      {error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <DragDropContext
        onDragStart={() => {
          if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
          }
        }}
        onDragEnd={(result) => {
          if (!result.destination) return;

          const reorderedQuestions = reorder(
            questions || [],
            result.source.index,
            result.destination.index
          ).map((i, order) => ({ ...i, order }));

          reorderQuestions({ formId, questions: reorderedQuestions });
        }}
      >
        <Droppable droppableId="questions">
          {(provided) => (
            <ul
              className={clsx(
                "h-full",
                "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded"
              )}
              {...provided.droppableProps}
              style={{
                overflow: "auto",
              }}
              ref={provided.innerRef}
            >
              {questions?.map((question) => (
                <DraggableQuestion key={question.id} question={question} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

function DraggableQuestion({
  question,
}: {
  question: QuestionCommunProps & { id: string; type: QuestionType };
}) {
  return (
    <Draggable
      key={question.id}
      index={question.order}
      draggableId={question.id}
    >
      {(provided, snapshot) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={clsx(
            "flex select-none flex-row items-center gap-4 px-2 py-4 hover:bg-indigo-50",
            snapshot.isDragging && "bg-indigo-100 shadow"
          )}
        >
          <QuestionIcon type={question.type} order={question.order} />
          <h2 className="truncate text-sm">{question.title}</h2>
        </li>
      )}
    </Draggable>
  );
}

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

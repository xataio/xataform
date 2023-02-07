import clsx from "clsx";
import { Button } from "components/Button";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  QuestionCommunProps,
  questionSchema,
  QuestionType,
} from "server/routers/question/question.schemas";

const mockItems = Array.from(questionSchema.optionsMap.keys()).map(
  (i, index) => ({
    description: null,
    id: `question-${index}`,
    illustration: null,
    order: index,
    title: i as string,
    type: i as QuestionType,
  })
);

export function ContentPanel() {
  return (
    <>
      <header className="flex items-center justify-between p-2 text-sm font-medium">
        <h1>Content</h1>
        <Button icon="add" iconOnly tooltipPlacement="bottom-start">
          Add a new question
        </Button>
      </header>
      <DragDropContext
        onDragStart={() => {
          if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
          }
        }}
        onDragEnd={(result) => {
          if (!result.destination) return;

          const questionId = result.draggableId;
          const nextOrder = result.destination?.index;
        }}
      >
        <Droppable droppableId="questions">
          {(provided) => (
            <ul
              className={clsx(
                "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-400 scrollbar-thumb-rounded"
              )}
              {...provided.droppableProps}
              style={{
                overflow: "scroll",
              }}
              ref={provided.innerRef}
            >
              {mockItems.map((question) => (
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
            "transition-all",
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

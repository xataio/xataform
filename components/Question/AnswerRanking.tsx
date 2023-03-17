import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
} from "react-beautiful-dnd";
import { reorder } from "utils/reoder";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";
import { EditChoicesDialog } from "./EditChoicesDialog";

function AnswerRanking({
  layout,
  choices,
  formId,
  questionId,

  ...question
}: AnswerProps<"ranking">) {
  const { updateQuestion } = useUpdateQuestion({ formId });

  const [isEditingChoices, setIsEditingChoices] = useState(false);

  const [rankedChoices, setRankedChoices] = useState(
    choices.map((value, rank) => ({ value, rank }))
  );

  useEffect(() => {
    if (question.randomize) {
      setRankedChoices(
        choices
          .sort(() => Math.random() - 0.5)
          .map((value, rank) => ({ value, rank }))
      );
    } else {
      setRankedChoices(choices.map((value, rank) => ({ value, rank })));
    }
  }, [choices, question.randomize]);

  return (
    <AnswerWrapper
      layout={layout}
      onClick={question.admin ? () => setIsEditingChoices(true) : undefined}
      onSubmit={() => {
        if (question.admin) return;
        question.onSubmit(rankedChoices.map((i) => i.value));
      }}
    >
      <EditChoicesDialog
        isOpen={isEditingChoices}
        onClose={() => setIsEditingChoices(false)}
        choices={choices}
        onSave={(nextChoices) => {
          setIsEditingChoices(false);
          updateQuestion({
            questionId,
            question: {
              ...question,
              type: "ranking",
              choices: nextChoices,
            },
          });
        }}
      />
      <p aria-live="polite" className="mb-1 text-xs text-indigo-700">
        Drag and drop to rank options
      </p>
      {rankedChoices.length === 0 && question.admin ? (
        <div className="w-fit rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700">
          Click to add your choices
        </div>
      ) : null}
      <DragDropContext
        onDragStart={() => {
          if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
          }
        }}
        onDragEnd={(result) => {
          const { destination } = result;
          if (!destination) return;
          setRankedChoices((prev) =>
            reorder(prev || [], result.source.index, destination.index).map(
              ({ value }, rank) => ({ value, rank })
            )
          );
        }}
      >
        <Droppable droppableId="ranking">
          {(droppableProvided) => (
            <ul
              {...droppableProvided.droppableProps}
              className={clsx(
                "w-fit pr-2",
                "scrollbar-thin  scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
                "h-52"
              )}
              style={{
                overflow: "auto",
              }}
              ref={droppableProvided.innerRef}
            >
              {rankedChoices.map((choice) => {
                return (
                  <Draggable
                    key={choice.value}
                    index={choice.rank}
                    draggableId={choice.value}
                  >
                    {(draggableProvided, snapshot) => (
                      <Choice
                        provided={draggableProvided}
                        snapshot={snapshot}
                        choice={choice}
                      />
                    )}
                  </Draggable>
                );
              })}
              {droppableProvided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </AnswerWrapper>
  );
}

function Choice({
  choice,
  provided,
  snapshot: { isDragging },
}: {
  choice: {
    rank: number;
    value: string;
  };
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) {
  const child = (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={clsx(
        "mt-2 focus:outline-none focus:ring-2 hover:bg-indigo-200",
        "select-none",
        "flex w-40 cursor-pointer flex-row items-center justify-between gap-2 rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700",
        isDragging && "bg-indigo-200 shadow"
      )}
    >
      <span>#{choice.rank}</span>
      <span>{choice.value}</span>
    </li>
  );

  if (!isDragging) {
    return child;
  }

  return ReactDOM.createPortal(child, document.body);
}

export default AnswerRanking;

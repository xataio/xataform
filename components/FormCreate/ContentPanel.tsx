import clsx from "clsx";
import { Button } from "components/Button";
import { QuestionIcon } from "components/Question/QuestionIcon";
import { useAddQuestion } from "hooks/useAddQuestion";
import { useReorderQuestions } from "hooks/useReorderQuestions";
import { useRouter } from "next/router";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  QuestionCommunProps,
  QuestionType,
} from "server/routers/question/question.schemas";
import { reorder } from "utils/reoder";
import { RouterOutputs, trpc } from "utils/trpc";
import { AddQuestionDialog } from "./AddQuestionDialog";

export type ContentPanelProps = {
  formId: string;
  questions: RouterOutputs["form"]["summary"];
  ending: RouterOutputs["ending"]["get"];
};

export function ContentPanel({ formId, questions, ending }: ContentPanelProps) {
  const router = useRouter();
  const { reorderQuestions } = useReorderQuestions();

  const { addQuestion } = useAddQuestion();
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);

  return (
    <>
      <AddQuestionDialog
        isOpen={isAddQuestionOpen}
        onAdd={async (questionType) => {
          setIsAddQuestionOpen(false);
          const { createdQuestion } = await addQuestion({
            formId,
            question: {
              type: questionType,
              title: "",
              order: questions?.length ?? 100,
              description: null,
              illustration: null,
            },
          });
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, questionId: createdQuestion.id },
            },
            undefined,
            { shallow: true }
          );
        }}
        onClose={() => setIsAddQuestionOpen(false)}
      />
      <header className="flex items-center justify-between p-2 text-sm font-medium">
        <h1>Content</h1>
        <Button
          icon="add"
          iconOnly
          tooltipPlacement="bottom-start"
          onClick={() => setIsAddQuestionOpen(true)}
        >
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
                "py-0.5",
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
      <header className="p-2 text-sm font-medium">
        <h1>Ending</h1>
      </header>
      <div
        onClick={() =>
          router.push(
            {
              pathname: router.pathname,
              query: { ...router.query, questionId: "ending" },
            },
            undefined,
            { shallow: true }
          )
        }
        className={clsx(
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:bg-indigo-100",
          "flex select-none flex-row items-center gap-4 px-2 py-4 hover:bg-indigo-100",
          "cursor-pointer",
          router.query.questionId === "ending" && "bg-slate-200"
        )}
      >
        <QuestionIcon type="statement" order="A" />
        <h2 className="truncate text-sm">{ending.title}</h2>
      </div>
    </>
  );
}

function DraggableQuestion({
  question,
}: {
  question: QuestionCommunProps & { id: string; type: QuestionType };
}) {
  const router = useRouter();
  const utils = trpc.useContext();

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
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus-visible:bg-indigo-100",
            "flex select-none flex-row items-center gap-4 px-2 py-4 hover:bg-indigo-100",
            snapshot.isDragging && "bg-indigo-100 shadow",
            router.query.questionId === question.id && "bg-slate-200"
          )}
          onClick={() =>
            router.push(
              {
                pathname: router.pathname,
                query: { ...router.query, questionId: question.id },
              },
              undefined,
              { shallow: true }
            )
          }
          onMouseOver={() =>
            utils.question.get.prefetch({
              questionId: question.id,
            })
          }
        >
          <QuestionIcon type={question.type} order={question.order + 1} />
          <h2 className="truncate text-sm">{question.title}</h2>
        </li>
      )}
    </Draggable>
  );
}

import { Button } from "components/Button";
import { useDeleteQuestion } from "hooks/useDeleteQuestion";
import { useEffect, useState } from "react";

export type DeleteQuestionButtonProps = {
  questionId: string;
  formId: string;
  disabled: boolean;
};

export function DeleteQuestionButton({
  questionId,
  formId,
  disabled,
}: DeleteQuestionButtonProps) {
  const { deleteQuestion } = useDeleteQuestion({ formId });
  const [areYouSure, setAreYouSure] = useState(false);
  useEffect(() => {
    const timerId = setTimeout(() => setAreYouSure(false), 2000);
    return () => clearTimeout(timerId);
  }, [areYouSure]);

  return (
    <Button
      disabled={disabled}
      icon={areYouSure ? "warning" : "trash"}
      variant={areYouSure ? "warning" : undefined}
      onClick={() => {
        if (areYouSure) {
          deleteQuestion({ questionId });
          setAreYouSure(false);
        } else {
          setAreYouSure(true);
        }
      }}
    >
      {areYouSure ? "Click to confirm" : "Delete question"}
    </Button>
  );
}

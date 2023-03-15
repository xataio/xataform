import clsx from "clsx";
import { useState } from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

import { StarIcon } from "@heroicons/react/20/solid";

function AnswerRating(props: AnswerProps<"rating">) {
  const [rating, setRating] = useState(0);

  return (
    <AnswerWrapper
      layout={props.layout}
      onSubmit={() => {
        if (props.admin) return;
        props.onSubmit(rating);
      }}
    >
      <fieldset
        aria-label={`Rating: ${rating} out of ${props.steps} stars`}
        className="w-fit outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
        tabIndex={0}
        onKeyUp={(e) => {
          if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
            setRating((prev) => {
              if (e.key === "ArrowLeft" && prev > 1) {
                return prev - 1;
              }
              if (e.key === "ArrowRight" && prev < props.steps) {
                return prev + 1;
              }
              return prev;
            });
          }
        }}
      >
        {new Array(props.steps).fill(0).map((_, index) => (
          <div
            role="radio"
            aria-label={`${index + 1} star${index + 1 > 1 ? "s" : ""}`}
            aria-checked={index + 1 === rating}
            key={index}
            className="group flex w-fit cursor-pointer focus:outline-none [&:not(:last-of-type)]:absolute"
            style={{
              zIndex: props.steps - index,
            }}
            onClick={() => setRating(index + 1)}
          >
            {new Array(index + 1).fill(0).map((_, i) => (
              <StarIcon
                aria-hidden="true"
                key={i}
                className={clsx(
                  "h-9 w-9",
                  "stroke-1",
                  index === props.steps - 1
                    ? "stroke-indigo-200 stroke-1 text-indigo-50"
                    : "stroke-transparent text-transparent",
                  index < rating && "stroke-yellow-600 text-yellow-400",
                  "group-hover:stroke-yellow-600 group-hover:text-yellow-200"
                )}
              />
            ))}
          </div>
        ))}
      </fieldset>
    </AnswerWrapper>
  );
}

export default AnswerRating;

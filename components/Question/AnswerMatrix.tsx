import { RadioGroup } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useUpdateQuestion } from "hooks/useUpdateQuestion";
import {
  CSSProperties,
  FocusEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnswerProps } from "./AnswerProps";
import { AnswerWrapper } from "./AnswerWrapper";

function AnswerMatrix(props: AnswerProps<"matrix">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstColumnWidth, setFirstColumnWidth] = useState(100);
  const { updateQuestion } = useUpdateQuestion({ formId: props.formId });
  const [rows, setRows] = useState(props.rows);
  useEffect(() => setRows(props.rows), [props.rows, setRows]);

  const [columns, setColumns] = useState(props.columns);
  useEffect(() => setColumns(props.columns), [props.columns, setColumns]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const maxWidth = Array.from(
      containerRef.current.getElementsByClassName("row")
    ).reduce((mem, node) => {
      if (node instanceof HTMLDivElement) {
        return Math.max(mem, node.getBoundingClientRect().width);
      } else {
        return mem;
      }
    }, 0);

    setFirstColumnWidth(Math.round(maxWidth));
  }, [containerRef, rows]);

  const columnsCount = props.columns.length;

  const addColumn = () =>
    updateQuestion({
      questionId: props.questionId,
      question: {
        ...props,
        columns: [...props.columns, ""],
      },
    });

  const addRow = () =>
    updateQuestion({
      questionId: props.questionId,
      question: {
        ...props,
        rows: [...props.rows, ""],
      },
    });

  const updateRow =
    (index: number) => (e: FocusEvent<HTMLInputElement, Element>) => {
      updateQuestion({
        questionId: props.questionId,
        question: {
          ...props,
          rows: [
            ...props.rows.slice(0, index),
            e.currentTarget.value,
            ...props.rows.slice(index + 1),
          ],
        },
      });
    };

  const updateColumn =
    (index: number) => (e: FocusEvent<HTMLInputElement, Element>) => {
      updateQuestion({
        questionId: props.questionId,
        question: {
          ...props,
          columns: [
            ...props.columns.slice(0, index),
            e.currentTarget.value,
            ...props.columns.slice(index + 1),
          ],
        },
      });
    };

  const removeRow = (index: number) => () => {
    console.log({
      index,
      rows: props.rows,
      next: [...props.rows.slice(0, index), ...props.rows.slice(index + 1)],
    });
    updateQuestion({
      questionId: props.questionId,
      question: {
        ...props,
        rows: [...props.rows.slice(0, index), ...props.rows.slice(index + 1)],
      },
    });
  };

  const removeColumn = (index: number) => () => {
    updateQuestion({
      questionId: props.questionId,
      question: {
        ...props,
        columns: [
          ...props.columns.slice(0, index),
          ...props.columns.slice(index + 1),
        ],
      },
    });
  };

  const rowStyle: CSSProperties = {
    gridTemplateColumns: `${Math.max(
      firstColumnWidth,
      100
    )}px repeat(${columnsCount}, minmax(100px, 1fr))`,
  };

  return (
    <AnswerWrapper layout={props.layout}>
      {props.admin && (
        <button
          onClick={addColumn}
          className="self-end text-sm text-indigo-700 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add column
        </button>
      )}
      <div
        ref={containerRef}
        className={clsx(
          "flex flex-col gap-2 text-center text-indigo-500",
          "scrollbar-thin scrollbar-thumb-slate-400 scrollbar-thumb-rounded",
          "max-w-3xl overflow-auto",
          "relative"
        )}
      >
        {/* Header */}
        <div className="fixed h-6 w-screen bg-white" aria-hidden="true" />
        <div className="sticky top-0 z-10 grid bg-white" style={rowStyle}>
          {columns.map((column, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className={clsx(
                columnIndex === 0 && "col-start-2",
                "z-20",
                "flex flex-row items-center justify-center",
                "m-auto",
                "w-full"
              )}
            >
              <button
                disabled={columns.length <= 1}
                onClick={removeColumn(columnIndex)}
                aria-label="Delete column"
                className={clsx(
                  "disabled:cursor-not-allowed",
                  "group m-1 flex items-center justify-center p-1 first-letter:first-line:rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                )}
              >
                <XMarkIcon className="h-4 w-4 rounded-full bg-indigo-600 text-white group-disabled:bg-slate-300" />
              </button>
              <input
                type="text"
                className={clsx(
                  "text-center",
                  "w-full",
                  "border-0 p-0 pr-6",
                  "focus:ring-0",
                  "placeholder:font-light placeholder:italic placeholder:text-indigo-300"
                )}
                value={column}
                onChange={(e) =>
                  setColumns((prev) =>
                    prev.map((i, index) =>
                      index === columnIndex ? e.target.value : i
                    )
                  )
                }
                onBlur={updateColumn(columnIndex)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
                placeholder={`Col ${columnIndex + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, rowIndex) => (
          <fieldset
            key={`row-${rowIndex}`}
            className="grid items-center justify-center rounded bg-indigo-50 py-2"
            style={rowStyle}
          >
            {props.admin ? (
              <div className="sticky left-0 flex w-full bg-indigo-50">
                <button
                  disabled={rows.length <= 1}
                  onClick={removeRow(rowIndex)}
                  aria-label="Delete row"
                  className={clsx(
                    "disabled:cursor-not-allowed",
                    "group mx-1 flex items-center justify-center rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  )}
                >
                  <XMarkIcon className="h-4 w-4 rounded-full bg-indigo-600 text-white group-disabled:bg-slate-300" />
                </button>
                <div
                  // Helper to calculate the width of the first column regarding the content
                  className="row absolute -z-50 select-none whitespace-nowrap pl-8 pr-6 text-transparent"
                  aria-hidden="true"
                >
                  {row}
                </div>
                <input
                  type="text"
                  className={clsx(
                    "w-full border-0 p-0 px-2",
                    "bg-indigo-50 focus:ring-0",
                    "placeholder:font-light placeholder:italic placeholder:text-indigo-300"
                  )}
                  value={row}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((i, index) =>
                        index === rowIndex ? e.target.value : i
                      )
                    )
                  }
                  onBlur={updateRow(rowIndex)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  placeholder={`Row ${rowIndex + 1}`}
                />
              </div>
            ) : (
              <div>{row || `Row ${rowIndex + 1}`}</div>
            )}
            {props.columns.map((column, columnIndex) => (
              <div key={`cell-${columnIndex}-${rowIndex}`}>
                <input
                  type="radio"
                  disabled={props.admin}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  value={column}
                  name={row}
                  aria-label={column}
                />
              </div>
            ))}
          </fieldset>
        ))}
      </div>
      {props.admin && (
        <button
          onClick={addRow}
          className="self-start text-sm text-indigo-700 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add row
        </button>
      )}
    </AnswerWrapper>
  );
}

export default AnswerMatrix;

function Option({ value, children }: { value: string; children: string }) {
  return (
    <RadioGroup.Option
      value={value}
      className={({ checked }) =>
        clsx(
          "focus:outline-none focus:ring-2 hover:bg-indigo-200",
          "flex w-40 cursor-pointer flex-row items-center justify-between gap-2 rounded border border-indigo-700 bg-indigo-100 px-2 py-1 text-indigo-700",
          checked && "bg-indigo-200 font-medium ring-1 ring-indigo-700"
        )
      }
    >
      {({ checked }) => (
        <>
          <span>{children}</span>
          {checked && <CheckIcon className="h-4 w-4" />}
        </>
      )}
    </RadioGroup.Option>
  );
}

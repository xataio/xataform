import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Answer } from "components/Question/Answer";
import {
  InferGetStaticPropsType,
  GetStaticPropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from "next";
import Image from "next/image";
import { RoutedQuery } from "nextjs-routes";
import { database } from "server/services/database";

export async function getStaticPaths() {
  const publishedForms = await database.listPublishedForms();

  return {
    paths: publishedForms.map((d) => ({
      params: {
        formId: d.id,
      },
    })),
    fallback: "blocking",
  } satisfies GetStaticPathsResult<RoutedQuery<"/form/[formId]">>;
}

export async function getStaticProps(
  context: GetStaticPropsContext<RoutedQuery<"/form/[formId]">>
) {
  const formId = context.params?.formId ?? "unknown";
  const questions = await database.listPublishedQuestions({ formId });

  if (questions.length === 0) {
    return {
      notFound: true,
    } satisfies GetStaticPropsResult<any>;
  }

  return {
    props: { questions },
  } satisfies GetStaticPropsResult<any>;
}

export default function Form(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <div>
      {props.questions.map((question) => (
        <div
          key={question.questionId}
          className={clsx(
            "h-full items-center",
            question.illustration ? "grid grid-cols-2" : "flex justify-center"
          )}
        >
          <div
            className={clsx(
              "grid grid-cols-header p-10",
              !question.illustration && "w-full p-28"
            )}
          >
            {/* Question number */}
            <div className="text mr-2 flex flex-row items-center gap-1 text-indigo-600">
              {question.order + 1}
              <ArrowRightIcon className="h-4 w-4" />
            </div>

            {/* Title */}
            <div className="relative">
              <h1>
                {question.title}
                {"required" in question && question.required ? (
                  <span className="pl-1 font-bold text-red-600">*</span>
                ) : null}
              </h1>
            </div>

            {/* Description */}
            <p>{question.description}</p>

            <Answer
              {...question}
              layout={question.illustration ? "split" : "full"}
              admin={false}
              onSubmit={(val) => alert(JSON.stringify(val))}
            />
          </div>

          {/* Illustation */}
          {question.illustration ? (
            <div className="relative h-full border">
              <Image
                fill
                className="object-cover"
                alt="todo"
                src={question.illustration}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

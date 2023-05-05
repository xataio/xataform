import {
  InferGetStaticPropsType,
  GetStaticPropsResult,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from "next";
import { RoutedQuery } from "nextjs-routes";
import { toast } from "react-toastify";
import { database } from "server/services/database";
import { trpc } from "utils/trpc";
import { Form } from "components/Form";
import Head from "next/head";

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
  const { questions, version } = await database.listPublishedQuestions({
    formId,
  });

  const ending = await database.getEnding({ formId });
  const form = await database.getForm(formId);

  if (questions.length === 0 || form === null) {
    return {
      notFound: true,
    } satisfies GetStaticPropsResult<any>;
  }

  return {
    props: { questions, formId, version, ending, form },
  } satisfies GetStaticPropsResult<any>;
}

export default function FormPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { mutate: submit } = trpc.form.submitFormAnswer.useMutation({
    onError(err) {
      toast.error(err.message);
    },
  });

  return (
    <>
      <Head>
        <title>XataForm - {props.form.title}</title>
      </Head>
      <Form
        questions={props.questions}
        ending={props.ending}
        onSubmit={(answers) =>
          submit({
            formId: props.formId,
            version: props.version,
            payload: answers,
          })
        }
      />
    </>
  );
}

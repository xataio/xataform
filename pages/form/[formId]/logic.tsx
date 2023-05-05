import { TRPCError } from "@trpc/server";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { formRouter } from "server/routers/form/form.router";
import { auth } from "server/services/auth";
import { database } from "server/services/database";
import { RouterOutputs, trpc } from "utils/trpc";

import { FormHeader } from "components/Form/FormHeader";
import { Box } from "components/Box";
import Head from "next/head";
import { FormLogicMain } from "components/FormLogic/FormLogicMain";

export default function FormLogic({
  form: initialForm,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: form } = trpc.form.get.useQuery(
    { formId: initialForm.id },
    {
      initialData: initialForm,
    }
  );

  return (
    <>
      <Head>
        <title>XataForm - Logic</title>
      </Head>
      <Box>
        <FormHeader form={form} page="logic" />
        <FormLogicMain formId={form.id} />
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  form: RouterOutputs["form"]["get"];
}> = async ({ req, params }) => {
  if (!params || typeof params.formId !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const trpcForm = formRouter.createCaller({
    user: await auth.getUser(req),
    db: database,
    revalidate: async () => {
      /* not used in this context */
    },
  });

  try {
    return {
      props: {
        form: await trpcForm.get({ formId: params.formId }),
      },
    };
  } catch (e) {
    if (e instanceof TRPCError && e.code === "NOT_FOUND") {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    throw e;
  }
};

import { TRPCError } from "@trpc/server";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { formRouter } from "server/routers/form/form.router";
import { auth } from "server/services/auth";
import { database } from "server/services/database";
import { RouterOutputs, trpc } from "utils/trpc";

import { Button } from "components/Button";
import { CreateFormMain } from "components/CreateForm/CreateFormMain";
import { Header } from "components/Header";
import Link from "next/link";
import { InlineEditTitle } from "components/CreateForm/InlineEditTitle";
import { useRenameForm } from "hooks/useRenameForm";

export default function FormCreate({
  form: initialForm,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: form } = trpc.form.get.useQuery(
    { formId: initialForm.id },
    {
      initialData: initialForm,
    }
  );
  const { renameForm } = useRenameForm();
  const { mutate: publish, isLoading } = trpc.form.publish.useMutation();

  return (
    <Box>
      <Header>
        <InlineEditTitle
          title={form.title}
          onSubmit={(nextTitle) =>
            renameForm({
              formId: form.id,
              title: nextTitle,
            })
          }
        />
        <div className="flex justify-center gap-2">
          <Link
            href={{
              pathname: "/form/[formId]/create",
              query: {
                formId: form.id,
              },
            }}
            className="inline-flex items-center border-b-4 border-indigo-300 px-2 pt-3 text-base font-medium text-white focus:bg-indigo-500 focus:outline-none"
          >
            Create
          </Link>
          {/* <Link
            href={{
              pathname: "/form/[formId]/results",
              query: {
                formId: form.id,
              },
            }}
            className="inline-flex items-center border-b-4 border-transparent px-2 pt-3 text-base font-medium text-indigo-300 hover:border-indigo-500 hover:text-indigo-200"
          >
            Results
          </Link> */}
        </div>
        <>
          <Link
            href={{
              pathname: "/form/[formId]",
              query: {
                formId: form.id,
              },
            }}
          >
            <Button icon="preview" variant="ghost">
              Preview
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => publish({ formId: form.id })}>
            {isLoading ? "Publishing…" : "Publish"}
          </Button>
        </>
      </Header>
      <CreateFormMain formId={form.id} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<{
  form: RouterOutputs["form"]["get"];
}> = async ({ res, req, params }) => {
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

function Box(props: React.PropsWithChildren) {
  return <div className="flex h-full flex-col" {...props} />;
}

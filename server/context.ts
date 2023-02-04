import * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { auth } from "./services/auth";
import { database } from "./services/database";

export const createContext = async ({
  req,
}: trpcNext.CreateNextContextOptions) => {
  const user = await auth.getUser(req);

  return { user, db: database };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

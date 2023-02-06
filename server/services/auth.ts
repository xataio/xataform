import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, NextApiRequest } from "next";

export const auth = {
  async getUser(req: NextApiRequest | GetServerSidePropsContext["req"]) {
    // get userId from request
    const { userId } = getAuth(req);
    // get full user object
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
  },
};

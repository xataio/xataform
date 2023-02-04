import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export const auth = {
  async getUser(req: NextApiRequest) {
    // get userId from request
    const { userId } = getAuth(req);
    // get full user object
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
  },
};

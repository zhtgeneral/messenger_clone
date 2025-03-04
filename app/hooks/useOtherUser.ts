import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

/**
 * This hook returns the other users of a conversation
 * @requires user needs to be authenticated using NextAuth
 * 
 * It checks if the user is logged in.
 * If so, it returns all the users whose emails differ from the current user
 */
export default function useOtherUser(conversation: FullConversationType | {users: User[]}): User {
  const session = useSession();
  const otherUser = React.useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const otherUser = conversation.users.filter((user) => user.email != currentUserEmail);
    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);
  return otherUser;
}
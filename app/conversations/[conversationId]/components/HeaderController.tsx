'use client'

import { useMemo, useState } from "react";

import useActiveList from "@/app/hooks/useActiveList";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import HeaderPresenter from "./HeaderPresenter";

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

/**
 * This component displays the title of the conversation.
 * 
 * If the conversation is 1 on 1 conversation, 
 * it renders the name of the other person and their active status.
 * 
 * Otherwise it renders the conversation name and the number of members in the group.
 * 
 * It renders a 3 dots button that opens a drawer that allows a user to delete the conversation.
 * 
 * @param conversation the conversation where the header is displayed
 */
export default function Header({
  conversation
}: HeaderProps) {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const statusText = useMemo((): string => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`
    }
    const otherUserOnline = members.indexOf(otherUser?.email!) != -1;
    return (otherUserOnline)? 'Online': "Offline";
  }, [conversation, otherUser, members]);

  return (
    <HeaderPresenter 
      conversation={conversation} 
      drawerOpen={drawerOpen}
      setDrawerOpen={setDrawerOpen}
      statusText={statusText}
      otherUser={otherUser}
    />
  )
}
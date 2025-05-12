'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { User } from "@prisma/client";
import React from "react";
import GroupChatModalPresenter from "./GroupChatModalPresenter";

interface GroupChatModalProps {
  users : User[],
  isOpen?: boolean,
  onClose: () => void;
}

/**
 * This component lets a user create a 1 on 1 or group chat.
 * 
 * It renders an input for the name of the group chat.
 * 
 * It renders a selector for the people in the chat.
 * 
 * It renders a cancel and create button.
 * When the cancel button is clicked, it calls `onClose` and closes the modal.
 * When the create button is pressed, it creates a group chat to by sending a POST request to `/api/conversations`
 * 
 * It renders the modal on a background that is dimmed.
 * 
 * It allows the user to exit by clicking on the `x` button in the top right,
 * clicking outside the modal, or pressing the ESC key.
 */
export default function GroupChatModal({
  users,
  isOpen,
  onClose
}: GroupChatModalProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  function onSubmit(data: any) {
    setIsLoading(true);
    axios.post('/api/conversations', {
      ...data,
      isGroup: true,
    })
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong'))
    .finally(() => setIsLoading(false));
  }

  return (
    <GroupChatModalPresenter 
      users={users}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={isLoading}
      isOpen={isOpen}
    />
  )
}
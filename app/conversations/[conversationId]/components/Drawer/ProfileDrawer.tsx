'use client'

import { format } from "date-fns";
import { Fragment } from "react";

import ConfirmModal from "@/app/conversations/[conversationId]/components/Drawer/ConfirmModal";
import useActiveList from "@/app/hooks/useActiveList";
import useOtherUser from "@/app/hooks/useOtherUser";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from '@headlessui/react';
import { Conversation, User } from "@prisma/client";
import React from "react";
import ProfileDrawerContent from "./ProfileDrawerContent";

interface ProfileDrawerProps {
  conversation: Conversation & {
    users: User[];
  }
  isOpen: boolean,
  onClose: () => void;
}

/**
 * This component displays actions and info of the users in the conversation.
 * 
 * The drawer opens with a smooth animation.
 * 
 * The background of the drawer is dimmed.
 * 
 * When the user clicks on the `x` button or outside the drawer,
 * it should close with an animation.
 */
export default function ProfileDrawer({
  conversation,
  isOpen,
  onClose
}: ProfileDrawerProps) {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();
  
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const title = React.useMemo(() => {
    return conversation.name || otherUser.name
  }, [conversation, otherUser])

  const statusText = React.useMemo((): string => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    const otherUserOnline = members.indexOf(otherUser?.email!) != -1;
    return (otherUserOnline)? 'Online': "Offline";
  }, [conversation, otherUser, members]);

  const joinedDate = React.useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP')
  }, [otherUser])

  return (
    <>
      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className='relative z-50' onClose={onClose}>
          <TransitionChild 
            as={Fragment}
            enter='ease-out duration-500' enterFrom='opacity-0'enterTo='opacity-100'
            leave='ease-in duration-500' leaveFrom='opacity-100' leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-40' />
          </TransitionChild>
          <div className='fixed inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <TransitionChild 
                as={Fragment} 
                enter='transform transition ease-in-out duration-500' enterFrom='translate-x-full' enterTo='translate-x-0'
                leave="transform transition ease-in-out duration-500" leaveTo='translate-x-full'
              >
                <DialogPanel className='pointer-events-auto w-screen max-w-md'>
                  <ProfileDrawerContent 
                    onClose={onClose}
                    conversation={conversation}
                    otherUser={otherUser}
                    setConfirmOpen={setConfirmOpen}
                    joinedDate={joinedDate}
                    statusText={statusText}
                    title={title}
                  />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
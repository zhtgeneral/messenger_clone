'use client'

import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import ProfileDrawer from "@/app/(site)/conversations/[conversationId]/components/Drawer/ProfileDrawer";
import { Conversation, User } from "@prisma/client";

interface HeaderPresenterProps {
  conversation: Conversation & {
    users: User[]
  },
  drawerOpen?: boolean,
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
  statusText?: string,
  otherUser: User
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
 */
export default function HeaderPresenter({
  conversation,
  drawerOpen = false,
  setDrawerOpen,
  statusText,
  otherUser
}: HeaderPresenterProps) {
  return (
    <>
      <ProfileDrawer 
        conversation={conversation} 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className='flex gap-3 items-center truncate'>
          <Link 
            id='returnButton' 
            href='/conversations' 
            className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'
          >
            <HiChevronLeft />
          </Link>
          {conversation.isGroup? (
            <AvatarGroup users={conversation.users}/>
          ): (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>
            <div className='text-sm font-light text-neutral-500'>{statusText}</div>
          </div>
        </div>
        <div className='pl-4'>
          <HiEllipsisHorizontal 
            id="sidebarDrawer" 
            size={32}
            onClick={() => setDrawerOpen(true)} 
            className="text-sky-500 cursor-pointer hover:text-sky-600"
          />
        </div>
      </div>
    </>
  )
}
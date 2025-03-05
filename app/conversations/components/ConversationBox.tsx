'use client'

import React from "react";

import clsx from "clsx";
import { format } from 'date-fns';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";

interface ConversationBoxProps {
  conversation: FullConversationType,
  isSelected?: boolean
}

/**
 * This component renders a conversation (should be on the sidebar)
 * 
 * It renders the avatars of the users in the conversations,
 * the name of the user(s) in the conversation,
 * the time the conversation was last updated,
 * and the last update of the conversaton.
 * 
 * @param conversation the conversation to be rendered
 * @param selected optional determines if the conversation is highlighted
 */
export default function ConversationBox({
  conversation,
  isSelected
}: ConversationBoxProps) {
  const session = useSession();
  const router = useRouter();
  const otherUser = useOtherUser(conversation);

  const handleClick = React.useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [router, conversation.id]);

  const lastMessage = React.useMemo(() => {
    const messages = conversation.messages;
    return messages.at(-1)!;
  }, [conversation.messages]);

  const userEmail: string = React.useMemo(() => {
    return session.data?.user?.email || "";
  }, [session.data?.user?.email]);

  /**
   * If the current user has seen the most recent message, this flag is true.
   */
  const hasSeen = React.useMemo(() => {
    if (!lastMessage || !userEmail) {
      return false;
    }
    const seenArray = lastMessage.seen || []
    return seenArray.some((s) => s.email === userEmail);
  }, [lastMessage, userEmail]);

  const lastMessageText = React.useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }
    if (lastMessage?.body ) {
      return lastMessage.body;
    }
    return 'Started a conversation';
  }, [lastMessage]);

  return(
    <div 
      id="conversationBox"
      onClick={handleClick} 
      className={
        clsx('w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-2',
          isSelected? 'bg-neutral-100' : 'bg-white'
        )
      }
    > 
      {conversation.isGroup? (
        <AvatarGroup users={conversation.users}/>
      ): (
        <Avatar user={otherUser}/>
      )}
      <div className="min-w-0 flex-1">
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className='text-xs font-medium text-gray-900 truncate'>
              {conversation.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-xs text-gray-400 font-light whitespace-nowrap'>
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>  
          <p className={clsx(
            'truncate text-xs', hasSeen? 'text-gray-500' : 'text-black font-medium'
          )}>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
}
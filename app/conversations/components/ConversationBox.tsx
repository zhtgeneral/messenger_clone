'use client'

import clsx from "clsx";
import { useCallback, useMemo } from "react";
import {format} from 'date-fns'
import { useSession } from "next-auth/react";
import { useRouter }  from "next/navigation";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { User } from "@prisma/client";
import AvatarGroup from "@/app/components/AvatarGroup";
import { 
  FullConversationType, 
  FullMessageType 
} from "@/app/types"

interface ConversationBoxProps {
  conversation: FullConversationType,
  selected?: boolean
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
 * @returns component
 */
const ConversationBox: React.FC<ConversationBoxProps> = ({
  conversation,
  selected
}) => {
  const session = useSession();
  const router = useRouter();
  const otherUser = useOtherUser(conversation);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [router, conversation.id]);

  const lastMessage = useMemo((): FullMessageType => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo((): string | null | undefined => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo((): boolean => {
    if (!lastMessage || !userEmail) {
      return false;
    }
    const seenArray = lastMessage.seen || [];
    return seenArray.filter((user: User) => user.email == userEmail).length != 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
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
      onClick={handleClick} 
      className={
        clsx('w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer p-2',
          selected? 'bg-neutral-100' : 'bg-white'
        )
      }
      id="conversationBox"
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

export default ConversationBox
'use client'

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType, FullMessageType } from "@/app/types"
import { User } from "@prisma/client";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {format} from 'date-fns'
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data     : FullConversationType,
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected
}) => {
  const otherUser = useOtherUser(data);
  const session   = useSession();
  const router    = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [router, data.id] )

  const lastMessage = useMemo((): FullMessageType => {
    const messages = data.messages || []
    return messages[messages.length - 1]
  }, [data.messages])

  const userEmail = useMemo((): string | null | undefined => {
    return session.data?.user?.email  
  }, [session.data?.user?.email])

  const hasSeen = useMemo((): boolean => {
    if (!lastMessage) return false
    const seenArray = lastMessage.seen || []
    if (!userEmail) return false
    return seenArray.filter((user: User) => user.email == userEmail).length != 0
  }, [lastMessage, userEmail])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return 'Sent an image'
    if (lastMessage?.body ) return lastMessage.body
    return 'Started a conversation'
  }, [lastMessage])

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
      {data.isGroup? (
        <AvatarGroup users={data.users}/>
      ): (
        <Avatar user={otherUser}/>
      )}
      <div className="min-w-0 flex-1">
        <div className='focus:outline-none'>
          <div className='flex justify-between items-center mb-1'>
            <p className='text-xs font-medium text-gray-900 truncate'>
              {data.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-xs text-gray-400 font-light whitespace-nowrap'>
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>  
          <p className={clsx('truncate text-xs', hasSeen? 'text-gray-500' : 'text-black font-medium')}>{lastMessageText}</p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
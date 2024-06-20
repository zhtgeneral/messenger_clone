'use client'

import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "@/app/conversations/components/ConversationBox";
import { FullConversationType } from "@/app/types"
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import GroupChatModal from "@/app/conversations/components/GroupChatModal";
import { User } from "@prisma/client";
import Button from "@/app/components/Button";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[],
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users
}) => {
  const session = useSession();
  const [items, setItems]             = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router                        = useRouter();
  const { conversationId, isOpen }    = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email])

  useEffect(() => {
    if (!pusherKey) return
    pusherClient.subscribe(pusherKey)
    // updates side bar to display new conversations at the top
    const newHandler = (conversation: FullConversationType) => {
      setItems((current): FullConversationType[] => {
        if (find(current, { id: conversation.id})) 
          return current
        return [conversation, ...current]
      })
    }
    // updates side bar to display recent message
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current): FullConversationType[]  => current.map((currentConversation) => {
        if (currentConversation.id == conversation.id)
          return {
            ...currentConversation,
            messages: conversation.messages
          }
        return currentConversation
      })
      )
    }

    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:update', updateHandler)
    return () => {
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind('conversation:new', newHandler)
      pusherClient.unbind('conversation:update', updateHandler)
    }
  }, [pusherKey])

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <aside className={
        clsx('fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
          isOpen? 'hidden' : 'block w-full left-0'
        )}>
        <div className='px-3'>
          <div className='flex justify-between mb-4 pt-4'> 
            <div className='text-2xl font-bold text-neutral-800 pl-1'>Messages</div>
            <Button type='button' onClick={() => setIsModalOpen(true)}>
              <div id="groupChat" className="flex items-center justify-center">
                <div className='pr-1'>
                  <TiUserAdd size={16} />
                </div>
                <p className='text-xs'>Group Chat</p>
              </div>
            </Button>
          </div> 
          {items.map((item) => (
            <ConversationBox key={item.id} data={item} selected={conversationId == item.id} />
          ))}
        </div>
      </aside>
    </>
  )
}
export default ConversationList
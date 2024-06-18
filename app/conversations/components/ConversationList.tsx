'use client'

import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "@/app/conversations/components/ConversationBox";
import { FullConversationType } from "@/app/types"
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import GroupChatModal from "@/app/conversations/components/GroupChatModal";
import { User } from "@prisma/client";

interface ConversationListProps {
  initialItems: FullConversationType[],
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users
}) => {
  const [items, setItems]             = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router                        = useRouter();
  const { conversationId, isOpen }    = useConversation();

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <aside className={
        clsx('fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200',
          isOpen? 'hidden' : 'block w-full left-0'
        )
      }>
        <div className='px-3'>
          <div className='flex justify-between mb-4 pt-4'> 
            <div className='text-2xl font-bold text-neutral-800 pl-1'>Messages</div>
            <div 
              id="groupChat" 
              onClick={() => setIsModalOpen(true)} 
              className='rounded-full bg-gray-100 text-gray-500 cursor-pointer hover:opacity-75 transition h-10 w-10 flex justify-center items-center'
            >
              <TiUserAdd size={30} />
            </div>
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
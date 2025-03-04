'use client'

import axios from "axios";
import clsx from "clsx";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { TiUserAdd } from "react-icons/ti";

import Button from "@/app/components/Button";
import ConversationBox from "@/app/conversations/components/ConversationBox";
import GroupChatModal from "@/app/conversations/components/GroupChatModal";
import useConversation from "@/app/hooks/useConversation";
import { pusherClient } from "@/app/libs/pusher";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React from "react";

interface ConversationListProps {
  conversations: FullConversationType[],
  users: User[]
}

/**
 * This component renders the conversations that a user can see.
 * @requires pusherClient needs to be set up first
 * 
 * It renders a button that allows opens a modal to create conversation.
 * 
 * When this component loads, it makes the current user subscribe to its channel and respond to the events:
 * `conversation:new`, `conversation:update`, `conversation:delete`
 * so that newly added/updated/removed conversations get displayed in real time on the sidebar.
 * 
 * When the conversationId, session, or route changes, 
 * it makes the user unsubscribe from the channels.
 */
export default function ConversationList({
  conversations,
  users
}: ConversationListProps) {
  const session = useSession();
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const [sidebarConversations, setSidebarConversations] = React.useState(conversations);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const email = React.useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  React.useEffect(() => {
    if (!email) {
      return;
    }
    pusherClient.subscribe(email);
    pusherClient.bind('conversation:new', newConversationSidebar);
    pusherClient.bind('conversation:update', updateConversationSidebar);
    pusherClient.bind('conversation:delete', deleteConversationSidebar);

    /**
     * This function takes the newest conversation and adds it to the event status on the sidebar.
     */
    async function newConversationSidebar(conversationId: string) {
      const response = await axios.get(`/api/conversations/${conversationId}`);
      const conversation = response.data;
      setSidebarConversations((current): FullConversationType[] => {
        if (find(current, { id: conversation.id})) {
          return current;
        }
        return [conversation, ...current];
      })
    }
    /**
     * This function updates the event status of the conversations on the sidebar.
     */
    async function updateConversationSidebar(conversationId: string) {
      const response = await axios.get(`/api/conversations/${conversationId}`);
      const conversation = response.data;
      setSidebarConversations((current): FullConversationType[] => current.map((currentConversation) => {
        if (currentConversation.id == conversation.id) {
          return {...currentConversation, messages: conversation.messages};
        }
        return currentConversation;
      }))
    }
    /**
     * This function deletes the conversation from the sidebar and takes the user to `/conversations`.
     */
    function deleteConversationSidebar(conversationId: string) {
      setSidebarConversations((current): FullConversationType[] => {
        return [...current.filter((currentConversation) => currentConversation.id != conversationId)];
      });
      if (conversationId == conversationId) {
        router.push('/conversations');
      }
    }

    return () => {
      pusherClient.unsubscribe(email);
      pusherClient.unbind('conversation:new', newConversationSidebar);
      pusherClient.unbind('conversation:update', updateConversationSidebar);
      pusherClient.unbind('conversation:delete', deleteConversationSidebar);
    }
  }, [email, conversationId, router]);

  return (
    <>
      <GroupChatModal 
        users={users} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
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
          {sidebarConversations.map((item) => (
            <ConversationBox 
              key={item.id} 
              conversation={item} 
              isSelected={conversationId == item.id} 
            />
          ))}
        </div>
      </aside>
    </>
  )
}
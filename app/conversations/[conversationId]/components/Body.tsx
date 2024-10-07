'use client'

import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { find } from "lodash"

import useConversation from "@/app/hooks/useConversation"
import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox"
import { FullMessageType } from "@/app/types"
import { pusherClient } from '@/app/libs/pusher'


interface BodyProps {
  initialMessages: FullMessageType[];
}

/**
 * This component renders all the messages in a conversation
 * 
 * It makes the user subscribe to the channels
 * `messages:new` and `message:update`
 * so whenever the conversation gets a new/seen message, the user gets realtime updates.
 * 
 * When the user leaves the conversation, it makes the user unsubscribe from the updates.
 
 * @param initialMessages the initial messages that get rendered
 * @returns component
 */
const Body: React.FC<BodyProps> = ({
  initialMessages
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const {conversationId} = useConversation();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);
    bottomRef?.current?.scrollIntoView();

    // display new messages
    async function messageHandler(messageId: string) {
      await axios.post(`/api/conversations/${conversationId}/seen`);
      const response = await axios.get(`/api/messages/${messageId}`);
      setMessages((current): FullMessageType[] => {
        if (find(current, {id: messageId})) {
          return current;
        }
        return [...current, response.data!];
      })
      bottomRef?.current?.scrollIntoView();
    }

    // marks message as seen
    async function updateMessageHandler(newMessageId: string) {
      const response = await axios.get(`/api/messages/${newMessageId}`);
      const newMessage = response.data!;
      setMessages((current): FullMessageType[] => current.map((currentMessage) => {
        if (currentMessage.id == newMessage.id) {
          return newMessage;
        }
        return currentMessage;
      }))
    }
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    }
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'> 
      {messages.map((message, i) => (
        <MessageBox 
          isLast={i == messages.length - 1} 
          key={message.id} 
          message={message} 
        />
      ))}
    </div>
  )
}

export default Body;
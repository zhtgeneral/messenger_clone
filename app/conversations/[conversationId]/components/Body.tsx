'use client'

import axios from "axios"
import { find } from "lodash"

import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox"
import useConversation from "@/app/hooks/useConversation"
import { pusherClient } from '@/app/libs/pusher'
import { FullMessageType } from "@/app/types"
import React from "react"


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
 */
export default function Body({
  initialMessages
}: BodyProps) {
  const {conversationId} = useConversation();
  
  const [messages, setMessages] = React.useState(initialMessages);

  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  React.useEffect(() => {
    pusherClient.subscribe(conversationId);
    pusherClient.bind('messages:new', displayNewMessage);
    pusherClient.bind('message:update', markMessageSeen);
    bottomRef?.current?.scrollIntoView();

    
    /**
     * This function is called whenever a channel gets a `messages:new` event.
     * 
     * It makes a POST request to /api/conversations/:conversationId/seen
     * and displays the new message in the body component.
     */
    async function displayNewMessage(messageId: string) {
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

    /**
     * This function is called whenever a channel gets a `messages:seen` event.
     * 
     * It maks a GET request to /api/messages/:newMessageId
     * and replaces the seen message with the one with updated status.
     */
    async function markMessageSeen(newMessageId: string) {
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
      pusherClient.unbind('messages:new', displayNewMessage);
      pusherClient.unbind('message:update', markMessageSeen);
    }
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto' id="conversationArea"> 
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
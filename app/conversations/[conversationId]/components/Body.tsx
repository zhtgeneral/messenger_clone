'use client'

import useConversation from "@/app/hooks/useConversation"
import { useEffect, useRef, useState } from "react"
import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox"
import { FullMessageType } from "@/app/types"
import axios from "axios"
import { pusherClient } from '@/app/libs/pusher'
import { find } from "lodash"

interface BodyProps {
  initialItems: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({
  initialItems
}) => {

  const [messages, setMessages] = useState(initialItems);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {conversationId} = useConversation();

  // useEffect(() => {
  //   axios.post(`/api/conversations/${conversationId}/seen`)
  // }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    // display new messages
    const messageHandler = async (messageId: string) => {
      await axios.post(`/api/conversations/${conversationId}/seen`)
      const response = await axios.get(`/api/messages/${messageId}`)
      setMessages((current): FullMessageType[] => {
        if (find(current, {id: messageId})) 
          return current
        return [...current, response.data!]
      })
      bottomRef?.current?.scrollIntoView();
    }

    // marks message as seen
    const updateMessageHandler = async (newMessageId: string) => {
      const response = await axios.get(`/api/messages/${newMessageId}`)
      const newMessage = response.data!
      setMessages((current): FullMessageType[] => current.map((currentMessage) => {
        if (currentMessage.id == newMessage.id) 
          return newMessage
        return currentMessage
      }))
    }
    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)
    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className='flex-1 overflow-y-auto'> 
      {messages.map((message, i) => (
        <MessageBox isLast={i == messages.length - 1} key={message.id} data={message} />
      ))}
      <div />
    </div>
  )
}

export default Body
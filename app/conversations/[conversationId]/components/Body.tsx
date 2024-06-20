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

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    // display new messages
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      // prevents duplicates
      setMessages((current) => {
        if (find(current, {id: message.id})) {
          return current
        }
        return [...current, message]
      })
      bottomRef?.current?.scrollIntoView();
    }

    // marks message as seen
    const updateMessageHandler = (newMessage: FullMessageType) => {
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
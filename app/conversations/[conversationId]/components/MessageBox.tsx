'use client'

import { useSession } from "next-auth/react";
import { useState } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import Image from 'next/image'

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import ImageModal from "@/app/conversations/[conversationId]/components/ImageModal";

interface MessageBoxProps {
  isLast?: boolean,
  message: FullMessageType
}

/**
 * This component displays a message item.
 * 
 * It renders the profile picture of the sender.
 * If the message is sent by the current user, render the message on the right.
 * Otherwise render it on the left.
 * 
 * If the message is an image, it renders the sent image.
 * Otherwise it renders the text message.
 * 
 * If the message is seen by the other user, 
 * the marking 'seen' appears next to the last image.
 * 
 * @param isLast determines if the message can render the 'seen' marking 
 * @param message the text or image message
 * @returns component
 */
const MessageBox: React.FC<MessageBoxProps> = ({
  isLast,
  message
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModelOpen] = useState(false);

  const isOwn = session?.data?.user?.email == message?.sender?.email;
  const seenList = (message.seen || [])
  .filter((user) => user.email != message?.sender?.email)
  .map((user) => user.name)
  .join(', ');

  return (
    <div id='userLine' className={clsx('flex gap-3 p-4', isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={message.sender}/>
      </div>
      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{message.sender.name}</div>
          <div className='text-xs text-gray-400'>{format(new Date(message.createdAt), 'p')}</div>
        </div>
        <div className='text-sm w-fit overflow-hidden'>
          <ImageModal 
            isOpen={imageModalOpen} 
            onClose={() => setImageModelOpen(false)} 
            src={message.image}
          />
          {message.image ? (
            <div className='rounded-md p-8'>
              <Image 
                onClick={() => setImageModelOpen(true)} 
                alt="Image" 
                height="180" width="180" 
                src={message.image} 
                className='object-cover cursor-pointer hover:scale-105 transition translate rounded-md' 
              />
            </div>
          ): (
            <div className='max-w-[80px] xxs:max-w-[150px] xs:max-w-[240px] sm:max-w-[360px] md:max-w-[500px] lg:max-w-[500px] xl:max-w-[700px] xxl:max-w-[800px] xxxl:max-w-[1400px] xxxxl:max-w-[1400px]'>
              <div  
                id='userMessage' 
                className={clsx('rounded-lg py-2 px-3 break-words', isOwn ? 'bg-sky-500 text-white': 'bg-gray-100')}>
                {message.body}
              </div>
            </div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className='text-xs font-light text-gray-500'>{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  )
} 

export default MessageBox
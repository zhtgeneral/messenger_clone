"use client"

import { useState } from "react";

import Image from 'next/image';
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Avatar from "@/app/components/Avatar";
import ImageModal from "@/app/conversations/[conversationId]/components/ImageModal";
import { FullMessageType } from "@/app/types";

interface MessageBoxProps {
  isLast?: boolean,
  message: FullMessageType
}

interface MessageProps {
  message: FullMessageType,
  displayDate: string,
  otherSeenList?: string,
  isLast?: boolean,
  imageModalOpen: boolean,
  setImageModelOpen: React.Dispatch<React.SetStateAction<boolean>>
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
 */
export default function MessageBox({
  isLast,
  message
}: MessageBoxProps) {
  const session = useSession();

  const [imageModalOpen, setImageModelOpen] = useState(false);

  const isOwn = session?.data?.user?.email == message?.sender?.email;  
  const otherSeenList = (message.seen || [])
  .filter((user) => user.email !== message?.sender?.email)
  .map((user) => user.name)
  .join(', ');

  const displayDate = format(new Date(message.createdAt), 'p');

  return (
    <div id='userLine'>
      {isOwn? (
        <OwnMessage 
          message={message} 
          displayDate={displayDate} 
          otherSeenList={otherSeenList} 
          isLast={isLast}
          imageModalOpen={imageModalOpen} 
          setImageModelOpen={setImageModelOpen}
        />
      ): (
        <OtherMessage 
          message={message} 
          displayDate={displayDate}
          imageModalOpen={imageModalOpen}
          setImageModelOpen={setImageModelOpen}          
        />
      )}
      
    </div>
  )
} 

/**
 * This component renders the image on the right of the screen in the app's main color.
 * If the last message is marked as seen, the seen text appears next to the message.
 * 
 * If the message is an image, it renders an image instead of a message.
 */
function OwnMessage({
  message,
  displayDate,
  otherSeenList,
  isLast = false,
  imageModalOpen,
  setImageModelOpen
}: MessageProps) {
  return (
    <div className="flex gap-3 p-4 justify-end">
      <div className='order-2'>
        <Avatar user={message.sender}/>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{message.sender.name}</div>
          <div className='text-xs text-gray-400'>{displayDate}</div>
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
                alt="User sent image" 
                // TODO make images appear larger for larger screens
                height="180" width="180" 
                src={message.image} 
                className='object-cover cursor-pointer hover:scale-105 transition translate rounded-md' 
              />
            </div>
          ): (
            <div className='max-w-[80px] xxs:max-w-[150px] xs:max-w-[240px] sm:max-w-[360px] md:max-w-[500px] lg:max-w-[500px] xl:max-w-[700px] xxl:max-w-[800px] xxxl:max-w-[1400px] xxxxl:max-w-[1400px]'>
              <div  
                id='userMessage' 
                className='rounded-lg py-2 px-3 break-words bg-sky-500 text-white'>
                {message.body}
              </div>
            </div>
          )}
        </div>
        {isLast && otherSeenList && otherSeenList.length > 0 && (
          <div id="seen_by" className='text-xs font-light text-gray-500'>{`Seen by ${otherSeenList}`}</div>
        )}
      </div>
    </div>
  )
}

/**
 * This component renders the image on the left of the screen in a grey color.
 * 
 * If the message is an image, it renders an image instead of a message.
 */
function OtherMessage({
  message,
  displayDate,
  imageModalOpen,
  setImageModelOpen
}: MessageProps) {
  return (
    <div className="flex gap-3 p-4">
      <div>
        <Avatar user={message.sender}/>
      </div>
      <div className="flex flex-col gap-2">
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{message.sender.name}</div>
          <div className='text-xs text-gray-400'>{displayDate}</div>
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
                alt="User sent image" 
                // TODO make images appear larger for larger screens
                height="180" width="180" 
                src={message.image} 
                className='object-cover cursor-pointer hover:scale-105 transition translate rounded-md' 
              />
            </div>
          ): (
            <div className='max-w-[80px] xxs:max-w-[150px] xs:max-w-[240px] sm:max-w-[360px] md:max-w-[500px] lg:max-w-[500px] xl:max-w-[700px] xxl:max-w-[800px] xxxl:max-w-[1400px] xxxxl:max-w-[1400px]'>
              <div  
                id='userMessage' 
                className='rounded-lg py-2 px-3 break-words bg-gray-100'>
                {message.body}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
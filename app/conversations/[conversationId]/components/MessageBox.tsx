'use client'

import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import Image from 'next/image'
import { useState } from "react";
import ImageModal from "@/app/conversations/[conversationId]/components/ImageModal";

interface MessageBoxProps {
  isLast?: boolean,
  data   : FullMessageType
}

const MessageBox: React.FC<MessageBoxProps> = ({
  isLast,
  data
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModelOpen] = useState(false)

  const isOwn = session?.data?.user?.email == data?.sender?.email;
  const seenList = (data.seen || [])
  .filter((user) => user.email != data?.sender?.email)
  .map((user) => user.name)
  .join(', ')

  return (
    <div id='userLine' className={clsx('flex gap-3 p-4', isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar user={data.sender}/>
      </div>
      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{data.sender.name}</div>
          <div className='text-xs text-gray-400'>{format(new Date(data.createdAt), 'p')}</div>
        </div>
        <div className='text-sm w-fit overflow-hidden'>
          <ImageModal isOpen={imageModalOpen} onClose={() => setImageModelOpen(false)} src={data.image}/>
          {data.image ? (
            <div className='rounded-md p-8'>
              <Image 
                onClick={() => setImageModelOpen(true)} 
                alt="Image" 
                height="180" width="180" 
                src={data.image} 
                className='object-cover cursor-pointer hover:scale-105 transition translate rounded-md' 
              />
            </div>
          ): (
            <div id='userMessage' className={clsx('rounded-full py-2 px-3', isOwn ? 'bg-sky-500 text-white': 'bg-gray-100')}>{data.body}</div>
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
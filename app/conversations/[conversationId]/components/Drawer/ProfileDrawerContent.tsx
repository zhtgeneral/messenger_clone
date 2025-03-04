'use client'

import { FaTrash } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';

import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { Conversation, User } from "@prisma/client";

interface ProfileDrawerContentProps {
  onClose: () => void,
  conversation: Conversation & {
    users: User[];
  },
  otherUser: User,
  title?: string | null,
  statusText?: string,
  setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>, 
  joinedDate?: string
}

/**
 * This component shows relevant info for a conversation.
 * 
 * For one on one conversations, it shows the single avatar icon, 
 * online status, delete conversation icon, email of other user, and join date.
 * 
 * For group conversations, it shows the multi avatar icon, all the emails together, and the delete button.
 */
export default function ProfileDrawerContent({
  conversation,
  onClose,
  otherUser,
  title = "Conversation",
  statusText = "Unknown",
  setConfirmOpen,
  joinedDate
}: ProfileDrawerContentProps) {
  return (
    <>
      <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
        <div className='px-4 sm:px-6'>
          <div className='flex items-start justify-end'>
            <div className='ml-3 flex h-7 items-center'>
              <button id='closeSidebar'
                type='button'
                onClick={onClose}
                className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
              >
                <span className='sr-only'>Close Panel</span>
                <IoClose size={24}/>
              </button>
            </div>
          </div>
        </div>
        <div className='relative mt-6 flex-1 px-4 sm:px-6'>
          <div className='flex flex-col items-center'>
            <div className='mb-2'>
              {conversation.isGroup? (
                <AvatarGroup users={conversation.users} />
              ): (
                <Avatar user={otherUser} />
              )}
            </div>
            <div className='max-w-full'>
              <div className='break-words'>{title}</div>
            </div>
            <div className='text-sm text-gray-500'>{statusText}</div>
            <div className='flex gap-10 my-8'>
              <div id='deleteButton' onClick={() => setConfirmOpen(true)} className='flex flex-col gap-1 items-center cursor-pointer hover:opacity-75'>
                <div className='w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center'>
                  <FaTrash size={20} className='text-white' />
                </div>
                <div className='text-sm text-neutral-600'>Delete</div>
              </div>
            </div>
            <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
              <dl id='conversationInfo' className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
                {conversation.isGroup && (
                  <div>
                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                      Emails
                    </dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                      {conversation.users.map((user) => user.email).join(', ')}
                    </dd>
                  </div>
                )}
                {!conversation.isGroup && (
                  <>
                    <div>
                      <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                        Email
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                        {otherUser.email}
                      </dd>
                    </div>
                    <hr />
                    <div>
                      <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                        Joined
                      </dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                        <time dateTime={joinedDate}>
                          {joinedDate}
                        </time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

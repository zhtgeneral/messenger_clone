'use client'

import Image from 'next/image';
import { TiUser } from "react-icons/ti";

import { User } from "@prisma/client"

interface AvatarGroupProps {
  users: User[];
}

/**
 * This component renders the profile pictures of a group chat.
 * 
 * It renders the profile pictures of the first 3 users in a triangle
 * where each profile picture is small. 
 * 
 * The stacked profile pictures should appear reasonable 
 * in proportion to a single profile picture.
 * 
 * @param users the users which to display the first 3 profile pictures
 * @returns component
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users
}) => {
  const slicedUsers = users.slice(0, 3)
  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }
  return (
    <div className='relative h-11 w-11'>
      {slicedUsers.map((user, index) => (
        <div 
          key={user.id} 
          className={`absolute inine-block rounded-full overflow-hidden h-[21px] w-[21px] ${positionMap[index as keyof typeof positionMap]}`} 
        > 
          {user?.image? (
            <Image alt='avatar' src={user?.image} fill />
          ): (
            <div className="flex items-center justify-center h-full w-full bg-gray-200">
              <TiUser size={30} className="text-gray-500"/>
            </div>
          )}
          
        </div>
      ))}
    </div>
  )
}

export default AvatarGroup
'use client'

import React from "react"
import Image from 'next/image'
import { TiUser } from "react-icons/ti";

import { User } from "@prisma/client"
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User
}

const Avatar: React.FC<AvatarProps> = ({
  user
}) => {
  const {members} = useActiveList()
  const isActive = members.indexOf(user?.email!) != -1
  return (
    <div className='relative'>
      <div className='relative inline-block rounded-full overflow-hidden h-11 w-11'>
        {user?.image? (
          <Image alt='avatar' src={user?.image} fill sizes='3' />
        ): (
          <div className="flex items-center justify-center h-full w-full bg-gray-200">
            <TiUser  size={42} className="text-gray-500"/>
          </div>
        )}
      </div>
      {isActive &&
        <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2' />
      }
    </div>
  )
}

export default Avatar

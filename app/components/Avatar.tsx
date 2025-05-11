'use client'

import React from "react"
import Image from 'next/image'
import { TiUser } from "react-icons/ti";

import { User } from "@prisma/client"
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User  
  size?: number
}

/**
 * This component renders the icon of the current user.
 * 
 * If the user is online, render a small green dot 
 * at the upper right of the user's profile picture.
 * 
 * Otherwise render just the user's profile picture.
 * 
 * If the user doesn't have a profile picture (default behaviour for a new account)
 * render a grey anonymous user icon instead.
 * 
 * @param user the user of which to display the profile picture 
 * @returns component
 */
export default function Avatar({
  user,
  size = 11
}: AvatarProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) != -1;

  const className = `relative inline-block rounded-full overflow-hidden ring-1 ring-gray-200 w-${size} h-${size}`;

  return (
    <div className='relative'>
      <div className={className}>
        {user?.image? (
          <Image alt='avatar' src={user?.image} fill sizes="3" />
        ): (
          <div className="flex items-center justify-center h-full w-full bg-gray-200">
            <TiUser size={42} className="text-gray-500"/>
          </div>
        )}
      </div>
      {isActive &&
        <span className='absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2' />
      }
    </div>
  )
}
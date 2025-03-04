'use client'

import { User } from "@prisma/client";
import Userbox from "@/app/users/components/UserBox";

interface UserListProps {
  users: User[]
}

/**
 * This component renders all the users of the app on the sidebar.
 */
export default function Userlist({
  users
}: UserListProps) {
  return (
    <aside className='fixed inset-y-0 pb-20 lg:pg-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0'>
      <div className='px-3'>
        <div className='flex-col'>
          <div className="text-2xl font-bold text-neutral-800 py-3 pl-1">People</div>
        </div>
        {
          users.map((item) => (
            <Userbox key={item.id} user={item}/>
          ))
        }
      </div>
    </aside>
  )
}
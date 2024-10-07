'use client'

import { useState } from "react"

import { User }        from "@prisma/client";
import useConversation from "@/app/hooks/useConversation";
import useRoutes       from "@/app/hooks/useRoutes";
import MobileItem      from "@/app/components/sidebar/items/MobileItem";
import SettingsModal   from "@/app/components/sidebar/settings/SettingsModal";
import SettingsButton  from '@/app/components/sidebar/settings/SettingsButton';

interface MobileFooterProps {
  currentUser: User
}

/**
 * This component renders the mobile footer and the available actions.
 * 
 * The footer renders at the bottom of the window and displays
 * a settings button,
 * a button to navigate to conversations,
 * a button to navigate to users,
 * and a button to logout.
 * 
 * @param currentUser the authenticated user
 * @returns component
 */
const MobileFooter: React.FC<MobileFooterProps> = ({
  currentUser
}) => {
  const  routes  = useRoutes();
  const {isOpen} = useConversation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  if (isOpen) return null;

  return (
    <>
      <SettingsModal currentUser={currentUser} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
      <div className='fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden'>
        <SettingsButton setModalIsOpen={setModalIsOpen} />
        {routes.map((route) => (
          <MobileItem 
            key={route.label} 
            href={route.href}
            active={route.active}
            icon={route.icon}
            onClick={route.onClick}
          />
        ))}
      </div>
    </>
  )
}
export default MobileFooter
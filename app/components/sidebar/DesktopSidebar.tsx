'use client'

import DesktopItem from "@/app/components/sidebar/items/DesktopItem";
import SettingsButton from "@/app/components/sidebar/settings/SettingsButton";
import SettingsModal from "@/app/components/sidebar/settings/SettingsModal";
import useRoutes from "@/app/hooks/useRoutes";
import { User } from "@prisma/client";
import React from "react";

interface DesktopSidebarProps {
  currentUser: User
}

/**
 * This component renders the sidebar and the available actions for desktop.
 * 
 * The sidebar appears on the left of the screen and displays
 * a button to navigate to the conversations,
 * a button to navigate to users,
 * a button to logout,
 * and a settings button.
 * 
 * @param currentUser the authenticated user
 */
export default function DesktopSidebar({
  currentUser
}: DesktopSidebarProps) {
  const routes = useRoutes();
  
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className='hidden lg:fixed lg:inset-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between'>
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-2" >
            {routes.map((item) => (
              <DesktopItem 
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className='mt-4 flex flex-col justify-between items-center'>
          <SettingsButton setModalIsOpen={setIsOpen} />
        </nav>
      </div>
    </>
  )
}
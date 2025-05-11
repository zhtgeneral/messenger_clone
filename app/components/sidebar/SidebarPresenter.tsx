import DesktopSidebar from "@/app/components/sidebar/DesktopSidebar"
import MobileFooter from "@/app/components/sidebar/MobileFooter"
import { User } from "@prisma/client";

interface SidebarPresenterProps {
  children?: React.ReactNode,
  user: User | null
}

/**
 * This component gives context for the types of sidebars.
 * @requires currentUser needs to be authenticated.
 * 
 * It renders the desktop sidebar depending on the conditions for `DesktopSidebar`.
 * 
 * It renders the mobile footer depending on the conditions for `MobileFooter`.
 * 
 * @param children the app the displays next to the sidebar 
 */
export default function SidebarPresenter({ 
  children,
  user
}: SidebarPresenterProps) {
  return (
    <div className="h-full" id="conversations">
      <DesktopSidebar currentUser={user!}/>
      <MobileFooter currentUser={user!}/>
      <main className='lg:pl-20 h-full'>
        {children}
      </main>
    </div>
  )
}
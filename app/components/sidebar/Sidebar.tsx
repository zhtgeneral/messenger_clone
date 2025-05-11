import getCurrentUser from "@/app/actions/getCurrentUser";
import SidebarPresenter from "./SidebarPresenter";

interface SidebarProps {
  children?: React.ReactNode 
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
export default async function Sidebar({ 
  children 
}: SidebarProps) {
  const currentUser = await getCurrentUser();
  return (
    <SidebarPresenter user={currentUser}>
      {children}
    </SidebarPresenter>
  )
}
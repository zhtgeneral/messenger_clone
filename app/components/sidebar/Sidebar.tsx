import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "@/app/components/sidebar/DesktopSidebar"
import MobileFooter from "@/app/components/sidebar/MobileFooter"

/**
 * This component gives context for the types of sidebars.
 * @requires currentUser needs to be authenticated.
 * 
 * It renders the desktop sidebar depending on the conditions for `DesktopSidebar`.
 * 
 * It renders the mobile footer depending on the conditions for `MobileFooter`.
 * 
 * @param children the app the displays next to the sidebar 
 * @returns component
 */
async function Sidebar({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full" id="conversations">
      <DesktopSidebar currentUser={currentUser!}/>
      <MobileFooter currentUser={currentUser!}/>
      <main className='lg:pl-20 h-full'>
        {children}
      </main>
    </div>
  )
}
export default Sidebar
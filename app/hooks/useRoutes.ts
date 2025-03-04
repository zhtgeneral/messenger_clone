import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiLogOut } from "react-icons/bi";
import { HiUsers } from "react-icons/hi2";
import { IoChatbubbles } from "react-icons/io5";
import useConversation from "./useConversation";

/**
 * This hook gets the routes used for the sidebar.
 * 
 * The routes are `/conversations`, `/users`, and `/#` for logout.
 * @returns react memo
 */
export default function useRoutes() {
  const pathname  = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    {
      label : 'Chat',
      href  : '/conversations',
      icon  : IoChatbubbles ,
      active: pathname == '/conversations' || conversationId as unknown as boolean
    },
    {
      label : 'Users',
      href  : '/users',
      icon  : HiUsers ,
      active: pathname == '/users'
    },
    {
      label : 'Logout',
      href  : '/#',
      onClick: () => signOut(),
      icon  : BiLogOut ,
    }
  ], [pathname, conversationId]);
  return routes;
}
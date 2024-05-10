import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { HiChat, HiUsers } from "react-icons/hi";
import { useMemo } from "react";
import { signOut } from "next-auth/react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";


export default function useRoutes() {
  const pathname           = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    {
      label : 'Chat',
      href  : '/conversations',
      icon  : HiChat,
      active: pathname == '/conversations' || conversationId as unknown as boolean
    },
    {
      label : 'Users',
      href  : '/users',
      icon  : HiUsers,
      active: pathname == '/users'
    },
    {
      label : 'Logout',
      href  : '/#',
      onClick: () => signOut(),
      icon  : HiArrowLeftOnRectangle,
    }
  ], [pathname, conversationId])

  return routes
}
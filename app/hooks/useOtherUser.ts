import { User } from "@prisma/client"
import { FullConversationType } from "@/app/types"
import { useSession } from "next-auth/react"
import { useMemo } from "react"

export default function useOtherUser(conversation: FullConversationType | {users: User[]}): User {
  const session   = useSession();
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email
    const otherUser = conversation.users.filter((user) => user.email != currentUserEmail)
    return otherUser[0]
  }, [session?.data?.user?.email, conversation.users])
  return otherUser
}
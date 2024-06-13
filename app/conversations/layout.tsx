import Sidebar from "@/app/components/sidebar/Sidebar"
import ConversationList from "@/app/conversations/components/ConversationList"
import getConversations from "@/app/actions/getConversations";
import getUsers from "@/app/actions/getUsers";

export default async function ConversationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList initialItems={conversations} users={users}/>
        {children}
      </div>
    </Sidebar>
  )
}
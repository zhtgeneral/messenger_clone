import Sidebar from "@/app/components/sidebar/Sidebar";
import getUsers from "@/app/actions/getUsers";
import Userlist from "@/app/(site)/users/components/Userlist";

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode
}) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className='h-full'>
        <Userlist users={users}/>
        {children}
      </div>
    </Sidebar>
  )
}
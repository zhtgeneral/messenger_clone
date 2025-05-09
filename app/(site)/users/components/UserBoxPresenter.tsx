
import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";

interface UserboxPresenterProps {
  user: User,
  isLoading?: boolean,
  handleClick?: () => void;
}

/**
 * This component renders a single user as a box.
 */
export default function UserboxPresenter({
  user,
  isLoading = false,
  handleClick
}: UserboxPresenterProps) {
  return (
    <>
      {isLoading && <LoadingModal />}
      <div id="userBox" onClick={handleClick} className='w-full relative flex items-center space-x-2 bg-white p-2 hover:bg-neutral-100 rounded-lg transition cursor-pointer'>
        <Avatar user={user}/>
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div className='flex justify-between items-center mb-1'>
              <p className='text-xs font-medium text-gray-900 overflow-hidden'>{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import { IconType } from "react-icons";
import { BsGithub, BsGoogle } from 'react-icons/bs';

interface AuthSocialButtonProps {
  type: 'GOOGLE' | 'GITHUB',
  onClick?: () => void;
}

/**
 * This component renders the icons used for social logins.
 * 
 * It makes the input icon perform the social login when clicked.
 * 
 * @param icon The icon displayed for this social login method
 * @param onClick the social login method
 * @returns component
 */
export default function AuthSocialButton({
  type,
  onClick
}: AuthSocialButtonProps) {
  return (
    <button 
      type='button' 
      onClick={onClick} 
      className='inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
    > 
    {
      (type === 'GITHUB')? (
        <BsGoogle />
      ): (
        <BsGithub />
      )
    }
      {/* <Icon /> */}
    </button>
  )
}

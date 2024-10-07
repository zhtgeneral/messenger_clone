import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  href: string,
  label: string,
  icon: any,
  active?: boolean,
  onClick?: () => void
}

/**
 * This component renders the actions for desktop sidebar.
 * 
 * When this item is clicked, it triggers redirects the user to `href` and performs `onClick`.
 * 
 * @param href the link to redirect the user to
 * @param label the label of the item
 * @param icon the icon to display on the item
 * @param active optional determines if the item is highlighted
 * @param active optional behaviour of item when clicked on
 * @returns 
 */
const DesktopItem: React.FC<DesktopItemProps> = ({
  href,   
  label,  
  icon: Icon,
  active,
  onClick
}) => {
  function handleClick()  {
    if (onClick) {
      return onClick();
    }
  }
  return (
    <li onClick={handleClick}>
      <Link 
        id="desktopItem"
        href={href} 
        className={
          clsx('group flex gap-x-1 rounded-md p-4 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100',
          active && 'bg-gray-100 text-black')
        }
      >
        <Icon className='h-6 w-6 shrink-0'/>
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  )
}
export default DesktopItem;


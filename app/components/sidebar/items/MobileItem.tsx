import clsx from "clsx"
import Link from "next/link"

interface MobileItemProps {
  href: string,
  active?: boolean,
  icon: any,
  onClick?: () => void
}

/**
 * This component displays the actions on the mobile footer.
 * 
 * When the mobile item is clicked, it triggers the `onClick`
 * @param href the link to redirect to
 * @param active optional determines if the item is highlighted
 * @param icon the icon displayed on the item
 * @param onClick optional the behaviour of the item when clicked
 * @returns component
 */
const MobileItem: React.FC<MobileItemProps> = ({
  href,
  active, 
  icon: Icon,
  onClick,
}) => {
  function handleClick() {
    if (onClick) {
      return onClick();
    }
  }
  return (
    <Link 
      id='mobileItem'
      href={href} 
      onClick={handleClick} 
      className={clsx(
        'group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-3 text-gray-500 hover:text-black hover:bg-gray-100',
        active && 'bg-gray-100 text-black'
        )}
      >
      <Icon className='h-6 w-6'/>
    </Link>
  )
}

export default MobileItem;
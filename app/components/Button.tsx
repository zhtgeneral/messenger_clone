'use client'

import clsx from "clsx";

interface ButtonProps {
  type?     :'button' | 'submit' | 'reset' | undefined;
  children? : React.ReactNode;
  onClick?  : () => void;
  fullWidth?: boolean;
  secondary?: boolean;
  danger?   : boolean;
  disabled? : boolean;
}

/**
 * This component renders a button with many adjustable properties.
 * 
 * The default color is bg-sky-500 and hovering on the button triggers cursor pointer.
 * 
 * @param type specifies the type of the button (native HTML types)
 * @param fullWidth specifies whether the button takes up 100% of the available width.
 * @param children the child components to render in the button
 * @param onClick specifies the action the button performs when clicked on.
 * @param secondary specifies the text of the button to appears dark instead of white.
 * @param danger specifies whether the button appears a rose color.
 * @param disabled specifies whether the button appears 50% opaque and blocks cursor pointer on hover
 * @returns component
 */
const Button: React.FC<ButtonProps> = ({
  type, fullWidth, children, onClick, secondary, danger, disabled
}) => {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={
      clsx('flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        disabled  && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        secondary? 'text-gray-900': 'text-white',
        !secondary && !danger && 'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
      )}>
      {children}
    </button>
  )
}
export default Button
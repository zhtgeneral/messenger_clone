'use client'

import clsx from "clsx";

interface ButtonProps {
  type?:'button' | 'submit' | 'reset' | undefined;
  children?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  secondary?: boolean;
  danger?: boolean;
  disabled? : boolean;
}

/**
 * This component renders a button with many adjustable properties.
 * 
 * The default color is bg-sky-500 and hovering on the button triggers cursor pointer.
 */
export default function Button({
  type, 
  fullWidth, 
  children, 
  onClick, 
  secondary, 
  danger, 
  disabled
}: ButtonProps) {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={
      clsx('flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        disabled  && 'opacity-50 cursor-not-allowed',
        fullWidth && 'w-full',
        danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        secondary? 'text-gray-900 border border-gray-300': 'text-white',
        !secondary && !danger && 'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
      )}>
      {children}
    </button>
  )
}
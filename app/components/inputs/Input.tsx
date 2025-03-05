'use client'

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}

export default function Input({
  label, 
  id, 
  type, 
  disabled, 
  required, 
  register, 
  errors
}: InputProps) {
  return (
    <div>
      <label className='block text-sm font-medium leading-6 text-gray-900' htmlFor={id}>
        {label}
      </label>
      <div className="mt-2">
        <input 
          id={id} 
          type={type} 
          autoComplete={id} 
          disabled={disabled} 
          {...register(id, {required})} 
          className={
            clsx(`
              form-input block w-full rounded-md border-0 py-1.5 
              text-gray-900 shadow-sm placeholder:text-gray-400 
              ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600
              sm:text-sm sm:leading-6
            `,
          errors[id] && 'focus:ring-rose-500',
          disabled   && 'cursor-default opacity-50'
        )}/>

      </div>
    </div>
  )
}
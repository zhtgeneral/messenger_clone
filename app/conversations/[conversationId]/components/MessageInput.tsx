import React from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface MessageInputProps {
  id: string,
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors
  type?: string
  required?: boolean
  placeholder?: string
}

/**
 * This component renders the input that a user uses to send text messages.
 * 
 * @param id - the id of the component used for querying in testing 
 */
export default function MessageInput({
  id,
  register,
  errors,
  type,
  required,
  placeholder
}: MessageInputProps) {
  return (
    <div className='relative w-full'>
      <input 
        id={id} 
        type={type} 
        autoComplete={id} 
        {...register(id, { required })}
        placeholder={placeholder}
        className='text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none'
      />
    </div>
  )
}
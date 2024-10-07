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
 * @param id id of the component used for querying in testing 
 * @param register the handler that observes the value of this input
 * @param errors optional errors that occur in the form
 * @param type optional type that does nothing really
 * @param required optional determines if the field is required
 * @param placeholder optional placeholder message
 * @returns component
 */
const MessageInput: React.FC<MessageInputProps> = ({
  id,
  register,
  errors,
  type,
  required,
  placeholder
}) => {
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

export default MessageInput;
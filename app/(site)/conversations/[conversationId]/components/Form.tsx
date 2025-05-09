'use client'

import axios from "axios"
import { CldUploadButton } from 'next-cloudinary'
import { FieldValues, useForm } from "react-hook-form"
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2"

import MessageInput from "@/app/(site)/conversations/[conversationId]/components/MessageInput"
import useConversation from "@/app/hooks/useConversation"

/**
 * This component allows a user to send a message
 * @requires NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET from Cloudinary dashboard
 * 
 * It renders a input that accepts non-empty strings as messages.
 * 
 * It renders a button that allows the user to upload image to cloudinary.
 * 
 * It renders a button that allows the user to send the message.
 * 
 * When the send button is clicked, the message is sent to the backend.
 */
export default function Form() {
  const {conversationId} = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  })
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  function onSubmit(data: FieldValues) {
    setValue('message', '', {shouldValidate: true});
    axios.post('/api/messages', {
      ...data,
      conversationId
    });
  }
  function handleUpload (result: any) {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    });
  }

  return (
    <div className='py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full'>
      <CldUploadButton 
        options={ {maxFiles: 1 }} 
        onSuccess={handleUpload} 
        uploadPreset={uploadPreset}
      >
        <HiPhoto size={30} className='text-sky-500'/>
      </CldUploadButton> 
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
        <MessageInput 
          id='message' 
          register={register} 
          errors={errors} 
          required 
          placeholder='Type Message' 
        />
        <button type='submit' className='rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition'>
          <HiPaperAirplane size={18} className='text-white'/>
        </button>
      </form>
    </div>
  )
}
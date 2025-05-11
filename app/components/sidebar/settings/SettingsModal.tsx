'use client'

import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Modal from "@/app/components/Modal";
import { User } from "@prisma/client";
import React from "react";
import Avatar from '@/app/components/Avatar';

interface SettingsModalProps {
  currentUser: User
  isOpen?: boolean,
  onClose: () => void;
}

/**
 * This component allows users to change their public info.
 * @requires user needs to be authenticated
 * @requires NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET upload preset from Cloudinary
 * 
 * It allows a user
 * to change their name,
 * to change their profile photo,
 * or to reset their profile photo to anonymous
 * and displays their currently up-to-date info.
 * 
 * Display name can be changed by text.
 * 
 * If a user edits their profile picture, it opens a 
 * Cloudinary modal that handles image uploads.
 * 
 * At the bottom, it renders a cancel and confirm button.
 * 
 * @param currentUser the authenticated user
 * @param isOpen determines if the modal renders
 * @param onClose determines the behavior for closing the modal
 */
export default function SettingsModal({
  currentUser,
  isOpen,
  onClose
}: SettingsModalProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState:{
      errors
    }
  }  = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      image: currentUser?.image
    }
  })
  const uploadPreset: string = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const image = watch('image');

  function handleUpload(result: any): void {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    });
  }

  function removeImage(): void {
    setValue('image', null);
  }
  
  /**
   * This helper function handles updating a user's info.
   * 
   * First it sets state as loading.
   * 
   * Then it calls the `POST` method with the data to `/api/settings`
   * where the user's info is updated.
   * If successful, refresh the page and close the modal.
   * Otherwise notify the user that an error has occured 
   * with a toaster displaying 'Something went wrong'.
   * 
   * Then remove the loading state.
   * 
   * @param data the data of the updated user
   */
  function onSubmit(data): void {
    setIsLoading(true);
    axios.post('/api/settings', data)
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something Went Wrong'))
    .finally(() => setIsLoading(false));
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <form onSubmit={handleSubmit(onSubmit)} className='px-8 py-4'>    
        <h2 className='text-lg font-semibold leading-7 text-gray-900'>Profile</h2>
        <p className='text-sm text-gray-600 leading-6'>Enter your user details</p>
        <div className='mt-4 flex flex-col'> 
          {/* Pfp input */}
          <div>
            <label className='block text-sm font-medium text-gray-900 leading-6'>Profile Picture</label>
            <div className='flex items-center gap-x-3 py-1'>
              <Avatar user={currentUser} size={16} />
              <div className="ml-auto flex flex-col gap-y-1">
                <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset={uploadPreset}>
                  <Button disabled={isLoading} secondary type='button'>
                    <div className="flex items-center justify-center text-sm">Upload</div>                      
                  </Button>
                </CldUploadButton>
                <Button type='button' disabled={isLoading} danger onClick={() => removeImage}>
                  <div className="flex items-center justify-center text-sm">Clear</div>
                </Button>
              </div>
            </div>
          </div>
          {/* Name input */}
          <Input 
            disabled={isLoading} 
            label="Name" 
            id="name" 
            errors={errors} 
            required
            register={register}
          />          
          {/* Email input */}
          <Input 
            disabled={true} 
            label="Email" 
            id="email" 
            errors={errors} 
            required
            register={register}
            className="pt-4"
          />              
        </div>        
        {/* Save and Cancel buttons */}
        <div className='flex flex-col items-center justify-end pt-8 gap-y-1'>
          <Button disabled={isLoading} fullWidth={true} type='submit'>Save</Button>
          <Button disabled={isLoading} secondary onClick={onClose} fullWidth={true}>Cancel</Button>
        </div>    
      </form>
    </Modal>
  )
}
'use client'

import Modal from "@/app/components/Modal"
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import Button from "@/app/components/Button";
import { TiUser } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface SettingsModalProps {
  currentUser: User
  isOpen?    : boolean,
  onClose    : () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose
}) => {
  const uploadPreset: string = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
      name : currentUser?.name,
      image: currentUser?.image
    }
  })

  const image = watch('image');
  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    });
  }
  const removeImage = () => {
    setValue('image', null)
  }
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios.post('/api/settings', data)
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something Went Wrong'))
    .finally(() => setIsLoading(false))
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>Profile</h2>
            <p className='mt-1 text-sm text-gray-600 leading-6'>Enter your public info</p>
            <div className='mt-10 flex flex-col gap-y-8'> 
              <Input 
                disabled={isLoading} 
                label="Name" 
                id="name" 
                errors={errors} 
                required
                register={register}
              />
              <div>
                <label className='block text-sm font-medium text-gray-900 leading-6'>
                  Photo
                </label>
                <div className='mt-2 flex items-center gap-x-3'>
                {/* <Image 
                    width="48" height="48" 
                    src={image || currentUser?.image || '/images/placeholder.png'}
                    alt="avatar"
                    className='rounded-full'
                  /> */}
                  {currentUser?.image? (
                    <Image 
                      width="48" height="48" 
                      src={image || currentUser?.image}
                      alt="avatar"
                      className='rounded-full'
                    />
                  ): (
                    <div className="flex items-center justify-center h-16 w-16 bg-gray-200 rounded-full">
                      <TiUser size={42} className="text-gray-500"/>
                    </div>
                  )}
                  <div className="ml-auto flex flex-col gap-2">
                    <CldUploadButton
                      options={{maxFiles: 1}}
                      onSuccess={handleUpload}
                      uploadPreset={uploadPreset}
                    >
                      <Button 
                        disabled={isLoading}
                        secondary
                        type='button'
                      >
                        <div className="flex items-center justify-center">
                          <div className='pr-2'>
                            <MdEdit className='text-gray-500 hover:text-gray-600 w-4 h-4' />
                          </div>
                          <p className='text-xs'>Change Image</p>
                        </div>                      
                      </Button>
                    </CldUploadButton>
                    <Button type='button' disabled={isLoading} danger onClick={() => removeImage}>
                      <div className="flex items-center justify-center">
                        <div className='pr-2'>
                          <FaTrash />
                        </div>
                        <p className='text-xs'>Reset Image</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type='submit'>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
export default SettingsModal
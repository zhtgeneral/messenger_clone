'use client'

import { FieldValues, useForm } from "react-hook-form";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import { User } from "@prisma/client";

interface GroupChatModalPresenterProps {
  users : User[],
  isOpen?: boolean,
  onClose: () => void,
  isLoading?: boolean,
  onSubmit?: (data: any) => void
}

/**
 * This component lets a user create a 1 on 1 or group chat.
 * 
 * It renders an input for the name of the group chat.
 * 
 * It renders a selector for the people in the chat.
 * 
 * It renders a cancel and create button.
 * When the cancel button is clicked, it calls `onClose` and closes the modal.
 * When the create button is pressed, it creates a group chat to by sending a POST request to `/api/conversations`
 * 
 * It renders the modal on a background that is dimmed.
 * 
 * It allows the user to exit by clicking on the `x` button in the top right,
 * clicking outside the modal, or pressing the ESC key.
 */
export default function GroupChatModalPresenter({
  users,
  isOpen,
  onClose,
  isLoading = false,
  onSubmit = (data: any) => {}
}: GroupChatModalPresenterProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name : '',
      members: []
    }
  })
  const members = watch('members')

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form id='groupChatModal' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>Create a group chat</h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>Create a group chat with 2 or more people</p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input 
                register={register}
                label="Name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
                />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true
                })}
                value={members}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <Button disabled={isLoading} onClick={onClose} type='button' secondary>Cancel</Button>
          <Button disabled={isLoading} type='submit' >Create</Button>
        </div>
      </form>
    </Modal>
  )
}
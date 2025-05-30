import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiAlertTriangle } from 'react-icons/fi';

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { DialogTitle } from "@headlessui/react";
import React from "react";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

/**
 * This component renders a modal that lets the user delete a conversation.
 * 
 * It renders a warning icon and message.
 * 
 * It renders a cancel and delete button.
 * 
 * When the delete button is clicked, it deletes the conversation 
 * and sends the user to `/conversations`.
 * 
 * It allows the user to close the modal by 
 * clicking on the `x` button, outside the modal, or the cancel button.
 * 
 * @param isOpen determines if the modal gets rendered
 * @param onClose the behaviour of closing the modal 
 * @returns component
 */
export default function ConfirmModal({
  isOpen,
  onClose,
}: ConfirmModalProps) {
  const router = useRouter();
  const { conversationId } = useConversation();
  
  const [isLoading, setIsLoading] = React.useState(false);

  const onDelete = React.useCallback(() => {
    setIsLoading(true);
    axios.delete(`/api/conversations/${conversationId}`)
    .then(() => {
      onClose();
      router.push('/conversations');
      router.refresh();
    })
    .catch(() => toast.error('Something went wrong'))
    .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  const deleteConfirmMessage = 'Are you sure you want to delete this conversation? This action cannot be undone.';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div id='confirmModal' className='sm:flex sm:items-start'>
        <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 justify-center'>
          <FiAlertTriangle className='h-6 w-6 text-red-600' />
        </div>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          <DialogTitle as='h3' className='text-base font-semibold leading-6 text-gray-900'>
            Delete conversation
          </DialogTitle>
          <div className="mt-2">
            <p>{deleteConfirmMessage}</p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 flex flex-row-reverse'>
        <Button disabled={isLoading} onClick={onDelete} danger>
          Delete
        </Button>
        <Button disabled={isLoading} onClick={onClose} secondary>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
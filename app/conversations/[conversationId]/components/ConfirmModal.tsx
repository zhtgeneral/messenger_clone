import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from 'react-icons/fi'

import { DialogTitle } from "@headlessui/react";
import Button          from "@/app/components/Button";
import Modal           from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";

interface ConfirmModalProps {
  isOpen?  : boolean;
  onClose  : () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router                    = useRouter();
  const {conversationId}          = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios.delete(`/api/conversations/${conversationId}`)
    .then(() => {
      onClose();
      router.push('/conversations');
      router.refresh()
    })
    .catch(() => toast.error('Something went wrong'))
    .finally(() => setIsLoading(false))
  }, [conversationId, router, onClose])

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
            <p>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      {/* <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'> */}
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

export default ConfirmModal;

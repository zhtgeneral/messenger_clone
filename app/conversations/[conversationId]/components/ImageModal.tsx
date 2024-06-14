'use client'

import Modal from "@/app/components/Modal";
import Image from 'next/image'

interface ImageModalProps {
  isOpen?: boolean,
  onClose: () => void;
  src?   : string | null
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Image 
        alt='Image'
        className='object-cover rounded-md'
        src={src!}
        width="360" height="360"
      />
    </Modal>
  )
}

export default ImageModal
'use client'

import Modal from "@/app/components/Modal";
import Image from 'next/image'

interface ImageModalProps {
  isOpen?: boolean,
  onClose: () => void;
  src?: string | null
}

/**
 * This component renders a modal that renders the image a user has sent
 * 
 * @param isOpen determines if the modal renders
 * @param onClose the behaviour of closing the modal
 * @param src the Cloudinary link of the sent image
 * @returns component
 */
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
        width="360" 
        height="360"
      />
    </Modal>
  )
}

export default ImageModal;
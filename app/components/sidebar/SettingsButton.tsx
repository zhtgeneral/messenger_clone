import React from "react"
import { IoMdSettings } from "react-icons/io"

interface SettingsButtonProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  setModalIsOpen
}) => {
  return (
    <div onClick={() => setModalIsOpen(true)} className='cursor-pointer hover:opacity-75 transition sm:px-3 lg:px-0 lg:py-1'>
      <IoMdSettings size="30" className='font-semibold text-gray-500 hover:text-black'/>
    </div>
  )
}

export default SettingsButton
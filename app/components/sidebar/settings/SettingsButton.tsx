import React from "react"
import { IoMdSettings } from "react-icons/io"

interface SettingsButtonProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * This component renders a settings icon.
 * 
 * When clicked on, it opens the settings modal where users can change their info.
 * 
 * @param setModalIsOpen determines if the settings modal should open
 * @returns component
 */
const SettingsButton: React.FC<SettingsButtonProps> = ({
  setModalIsOpen
}) => {
  return (
    <div id="settingsButton" onClick={() => setModalIsOpen(true)} 
      className='cursor-pointer hover:opacity-75 transition px-3 lg:px-0 lg:py-1'>
      <IoMdSettings size="30" className='font-semibold text-gray-500 hover:text-black'/>
    </div>
  )
}

export default SettingsButton
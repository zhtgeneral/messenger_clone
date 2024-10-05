'use client'

import {Toaster} from 'react-hot-toast'

/**
 * This components gives context for react toaster.
 * 
 * It allows react hot toast to be used whever in the app.
 * 
 * @returns component rendering context for toaster from `react-hot-toast`
 */
const ToasterContext = () => {
  return (
    <Toaster />
  )
}

export default ToasterContext;
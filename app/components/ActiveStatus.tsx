'use client'

import useActiveChannel from "../hooks/useActiveChannel"

/**
 * This component gives context for Pusher's active channels.
 * 
 * @returns component 
 */
const ActiveStatus = () => {
  useActiveChannel();
  return (
    null
  )
}

export default ActiveStatus
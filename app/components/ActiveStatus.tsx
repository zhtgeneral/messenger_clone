'use client'

import useActiveChannel from "../hooks/useActiveChannel"

/**
 * This component gives context for Pusher's active channels.
 * 
 * @returns component 
 */
export default function ActiveStatus() {
  useActiveChannel();
  return (
    null
  )
}
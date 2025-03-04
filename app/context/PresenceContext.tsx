"use client"

import useActiveChannel from "../hooks/useActiveChannel";

/**
 * This context gives sets up the present members.
 * 
 * @requires AuthContext needs to wrap this context.
 * 
 * @Note if this is not called, `useActiveList` always returns empty members.
 */
export default function PresenceInitializer() {
  useActiveChannel();
  return null;
}
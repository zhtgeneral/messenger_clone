'use client'

import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: React.ReactNode
}
/**
 * This component gives context to the `getSession` hook from NextAuth.
 * 
 * @link https://next-auth.js.org/getting-started/example
 */
export default function AuthContext({
  children
}: AuthContextProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
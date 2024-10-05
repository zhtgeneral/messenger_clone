// copy and pasted straight from here 

'use client'

import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: React.ReactNode
}
/**
 * This component gives context for NextAuth.
 * 
 * Any child of AuthContext can call `getSession` from NextAuth.
 * 
 * @link https://next-auth.js.org/getting-started/example
 * 
 * @returns context for `getSession`
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
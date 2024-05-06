// copy and pasted straight from here 
// @see https://next-auth.js.org/getting-started/example

'use client'

import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: React.ReactNode
}

export default function AuthContext({children}: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>
}
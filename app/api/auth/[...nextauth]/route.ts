// if only I knew how to pull this from my a$$
// https://next-auth.js.org/getting-started/example

import NextAuth from "next-auth"
import authOptions from '@/app/libs/authOptions'

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
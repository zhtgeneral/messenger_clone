import NextAuth from "next-auth"
import authOptions from "@/app/libs/authOptions"

// copy from the docs here https://next-auth.js.org/configuration/initialization
// creates handler for nextAuth Object
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST } 
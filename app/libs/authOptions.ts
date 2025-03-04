import prisma from '@/app/libs/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from 'bcrypt'
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

/**
 * Creates the auth options used for logging users in.
 * 
 * Options specified prisma as adapter.
 * 
 * Github, google and email are set as providers.
 * 
 * For email authentication, the email and password are required.
 * If missing, throw an error.
 * 
 * If user is missing from backend, throw an error.
 * 
 * If the password is incorrect, throw an error.
 * 
 * @requires NEXTAUTH_SECRET variable from env file
 * @requires GITHUB_ID variable from env file
 * @requires GITHUB_SECRET variable from env file (gotten from github.com/settings/developers)
 * @requires GOOGLE_CLIENT_ID variable from env file
 * @requires GOOGLE_CLIENT_SECRET variable from env file (gotten from GCC)
 * 
 * @link https://next-auth.js.org/getting-started/example
 */
const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label: 'password', type: 'password'}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials');
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials');
        }
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isCorrectPassword) {
          throw new Error('Invalid Credentials');
        }
        return user;
      }
    })
  ],
  debug: process.env.NODE_ENV == 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET as string,
}
export default authOptions;

// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { Session, getServerSession } from 'next-auth'
import authOptions from '../libs/authOptions';

/**
 * This helper function is from NextAuth and gets the session.
 * @returns a Session or null.
 */
export default async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}
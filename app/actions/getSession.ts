// import { authOptions } from '@/app/api/auth/[...nextauth]/route'


import { Session, getServerSession } from 'next-auth'
import authOptions from '../libs/authOptions';

export default async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}
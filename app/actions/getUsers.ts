import getSession from "@/app/actions/getSession";
import prisma from '@/app/libs/prismadb' 
import { User } from "@prisma/client"

/**
 * This helper function gets all the users except the current one.
 * 
 * If gets the session from NextAuth.
 * If the current user doesn't have an emeil, return `[]`.
 * 
 * Otherwise it returns all the users minus the current user.
 * The users are in descending order by the created date.
 * 
 * @returns an array of users
 */
export default async function getUsers(): Promise<User[]> {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        }
      }
    });
    return users;
  } catch (error: any) {
    return [];
  }
}
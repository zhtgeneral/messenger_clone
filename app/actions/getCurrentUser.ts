import getSession from "@/app/actions/getSession";
import prisma from '@/app/libs/prismadb' 
import { User } from "@prisma/client";

/**
 * This helper function gets the current user.
 * 
 * It gets the current session using NextAuth 
 * and checks if the user has an `email`.
 * If not, it returns `null`.
 * 
 * Otherwise it finds the user from the database.
 * If there is no user from the database, it returns `null`.
 * 
 * Otherwise it returns the user.
 * 
 * If any error occurs, return `null`.
 */
export default async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error: any) {
    return null;
  }
}


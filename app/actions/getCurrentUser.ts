import getSession from "@/app/actions/getSession";
import prisma from '@/app/libs/prismadb' 
import { User } from "@prisma/client";

export default async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });
    if (!currentUser) return null;
    return currentUser
  } catch (error: any) {
    return null;
  }
}


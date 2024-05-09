import getSession from "@/app/actions/getSession";
import prisma from '@/app/libs/prismadb' 
import { User } from "@prisma/client"

export default async function getUsers(): Promise<User[]> {
  const session = await getSession();
  if (!session?.user?.email) return []
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
    })
    return users;
  } catch (error: any) {
    return [];
  }
}
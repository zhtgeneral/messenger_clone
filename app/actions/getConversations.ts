import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb' 
import { FullConversationType } from "../types";

export default async function getConversations(): Promise<FullConversationType[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: { 
          has: currentUser.id
        }
      },
      include: {
        users   : true,
        messages: {
          include: {
            sender: true,
            seen  : true
          }
        }
      }
    });
    return conversations;
  } catch (error: any) {
    return []
  }
}
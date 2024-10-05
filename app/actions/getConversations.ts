import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb' 
import { FullConversationType } from "@/app/types";

/**
 * This helper function gets all conversations of the current user.
 * 
 * If the current user doesn't have an id, return empty array.
 * 
 * Otherwise get the conversations from the database in descending order by lastMessage
 * and return it.
 * 
 * If any error occurs, return an empty array.
 * 
 * @returns 
 */
export default async function getConversations(): Promise<FullConversationType[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return [];
  }
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
    return [];
  }
}
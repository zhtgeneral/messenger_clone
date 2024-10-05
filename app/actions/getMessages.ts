import prisma from '@/app/libs/prismadb' 
import { FullMessageType } from "../types"


/**
 * This helper function gets all the messages of a conversation.
 * 
 * It gets the messages from the database 
 * in ascending order by the date it was created.
 * 
 * @param conversationId the id of the conversation
 * @returns an array of messages
 */
export default async function getMessages(
  conversationId: string
): Promise<FullMessageType[]> {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: true,
        seen  : true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return messages;
  } catch (error: any) {
    return [];
  }
}
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';
import { Conversation, User } from "@prisma/client";

interface ConversationWithUsers extends Conversation {
  users: User[]
}

/**
 * This helper function gets a conversation from the database.
 * If the current user doesn't have an email, return null.
 * 
 * Otherwise return the conversation from the database.
 * 
 * If any error occurs, return null.
 * 
 * @param conversationId the conversation Id
 * @returns the conversation from the database
 */
export default async function getConversationById(
  conversationId: string
): Promise<ConversationWithUsers | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return null
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });
    return conversation
  } catch (error: any) {
    return null;
  }
}
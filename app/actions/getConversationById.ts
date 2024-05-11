import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb' 
import { Conversation } from "@prisma/client";

export default async function getConversationById(conversationId: string): Promise<Conversation | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) return null
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })
    return conversation
  } catch (error: any) {
    return null;
  }
}
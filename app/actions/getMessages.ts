import { Message } from "@prisma/client"
import prisma from '@/app/libs/prismadb' 
import { FullMessageType } from "../types"

export default async function getMessages(conversationId: string): Promise<FullMessageType[]> {
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
    })
    return messages
  } catch (error: any) {
    return []
  }
}
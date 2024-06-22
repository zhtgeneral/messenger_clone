import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 })
    
    const { conversationId } = params;
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })
    if (!existingConversation)
      return new NextResponse('Invalid ID', {status: 400})

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    // observers get notified of deleted conversations in real time
    existingConversation.users.forEach(async (user) => {
      if (user.email)
        await pusherServer.trigger(user.email, 'conversation:delete', existingConversation.id)
    })

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE')
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse('Unauthorized', { status: 401 })
    
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId
      },
      include: {
        users: true,
        messages: true
      }
    }).catch((error) => console.log(error, 'ERROR_CONVERSATION_GET_PRISMA'))
    return NextResponse.json(conversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_GET')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
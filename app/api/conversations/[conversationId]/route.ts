import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

/**
 * This API endpoint handles the deletion of conversations.
 * @requires params needs to contain conversationId on the url.
 * 
 * It checks if the user has an `id` and `email`. If not, throw a `401` error for unauthorized.
 * 
 * It checks if the conversation exists. If not, throw an `400` error for invalid id.
 * 
 * If the above is satisfied, delete the conversation from the backend.
 * Then notify each of the observers on channel `conversation:delete`.
 * 
 * If any error occurs elsewhere, throw a `500` error for internal error.
 * 
 * @param _request a request (unused)
 * @param params the params that holds the `conversationId`
 * @returns a `200` response with the deleted conversation
 */
export async function DELETE(
  _request: Request, 
  { params }: { params: IParams }
): Promise<NextResponse> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
    const { conversationId } = params;
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })
    if (!existingConversation) {
      return new NextResponse('Invalid ID', {status: 400})
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    // observers get notified of deleted conversations in real time
    // TODO fix performance problem by adding all promises and awaiting all.
    existingConversation.users.forEach(async (user) => {
      if (user.email) {
        await pusherServer.trigger(user.email, 'conversation:delete', existingConversation.id)
      }
    })

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE')
    return new NextResponse('Internal Error', { status: 500 })
  }
}

/**
 * This API endpoint handles getting a conversation.
 * 
 * @requires params needs to contain the conversation id on the url.
 * 
 * It checks if the current user has an `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * Otherwise, find the conversation from the backend and return it.
 * If an error occurs at reading the backend specifically, log the error.
 * 
 * If an error occurs anywhere else, throw a `500` error for internal error.
 * 
 * @param _request unused request
 * @param params the params on the url that contain `conversationId`
 * @returns a `200` response with the conversation 
 */
export async function GET(
  _request: Request,
  { params }: { params: IParams }
): Promise<NextResponse> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    
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
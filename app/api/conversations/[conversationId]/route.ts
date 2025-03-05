import { Conversation, User } from "@prisma/client";
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

type ConversationWithUsers = Conversation & {
  users: User[]
}

interface IParams {
  conversationId?: string;
}

/**
 * This API endpoint handles the deletion of conversations.
 * 
 * @requires user must be logged in.
 * @requires params needs to contain conversationId.
 * 
 * It checks if the user has an `id` and `email`. 
 * If not, throw a `401` error for unauthorized.
 * 
 * It checks if the conversationId exists on the params. 
 * If not, throw an `400` error for invalid id.
 * 
 * If an existing conversation cannot be retrieved, 
 * throw a `404` error for unknown `conversationId`.
 * 
 * Otherwise delete the conversation and notify every member on their sidebar.
 * 
 * If any error occurs elsewhere, throw a `500` error for internal error.
 * 
 * @note _request parameter stays unused 
 */
export async function DELETE(
  _request: Request, 
  { params }: { params: IParams }
): Promise<NextResponse> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { conversationId } = params;
    if (!conversationId) {
      return new NextResponse('conversationId must be on params', { status: 400 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });
    if (!existingConversation) {
      return new NextResponse('unknown conversationId', { status: 404 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    });

    await notifyMemebersDeleteConversation(existingConversation);

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE')
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * This API endpoint handles getting a conversation.
 * 
 * @requires user must be logged in.
 * @requires params needs to contain conversationId.
 * 
 * It checks if the current user has an `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * It checks if conversationId is on the params.
 * If not, throw a `400` error invalid id.
 * 
 * It a conversation cannot be retrieved, 
 * throw a `404` error for not found.
 * 
 * Otherwise, find the conversation from the database and return it.
 * 
 * If an error occurs anywhere else, throw a `500` error for internal error.
 * 
 * @note _request parameter stays unused 
 */
export async function GET(
  _request: Request,
  { params }: { params: IParams }
): Promise<NextResponse> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { conversationId } = params;
    if (!conversationId) {
      return new NextResponse('conversationId must be on params', { status: 400 });
    }
    
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
        messages: true
      }
    });
    if (!conversation) {
      return new NextResponse('unknown conversation', { status: 404 });
    }
    
    return NextResponse.json(conversation);
  } catch (error: unknown) {
    console.log(error, 'ERROR_CONVERSATION_GET')
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * For every member update their sidebar for deleted conversation.
 */
async function notifyMemebersDeleteConversation(existingConversation: ConversationWithUsers) {
  const deleteNotificationPromises = existingConversation.users.map((user) => {
    if (user.email) {
      pusherServer.trigger(user.email, 'conversation:delete', existingConversation.id);
    }
  })
  await Promise.all(deleteNotificationPromises); 
}
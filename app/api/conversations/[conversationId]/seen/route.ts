import { Conversation, Message, User } from "@prisma/client";
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from "@/app/libs/pusher";

type ConversationWithUsers = Conversation & {
  users: User[]
}

interface IParams {
  conversationId?: string
}

/**
 * This API endpoint handles marking conversations as seen.
 * @requires params needs to contain the `conversationId`.
 * 
 * It checks if the current user has an `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * It finds the conversation from the backed.
 * It the conversation can't be found, it throws a `400` error for invalid id.
 * 
 * From the conversation, check that the last message exists.
 * If not, return the conversation.
 * 
 * Otherwise update the last message as seen and include the sender in the database.
 * 
 * Then notify everyone in the conversation on channel `conversation:update` 
 * that the conversation has been seen. 
 * This part is used to update the bold font on the sidebar.
 * If an error occurs when notifying, console log the error under `ERROR_MESSAGES_SEEN_UPDATE_CONVERSATION`
 * 
 * Then notify everyone in the conversation excluding the current user on channel `message:update` 
 * that last message has been seen.
 * This part is used to updated the messages as seen in the chat.
 * If an error occurs when notifying, console log the error under `ERROR_MESSAGES_SEEN_UPDATE_MESSAGE`
 * 
 * If any other error occurs, throw a `500` error for internal error and console log it.
 * 
 * @param request unused request
 * @param params params on the url that contains `conversationId`
 * @returns a `200` response with the updated message
 */
export async function POST(
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
        messages: {
          include: {
            seen: true
          }
        },
        users: true
      }
    });
    if (!conversation) {
      return new NextResponse('unknown conversation', { status: 404 });
    }

    const lastMessage = conversation.messages.at(-1);
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const seenMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    const notifications = [
      notifySelfCaughtUpOnConversation(conversation, currentUser),
      notifyReadersSeenMessage(conversation, seenMessage)
    ];
    await Promise.all(notifications);    
    
    return NextResponse.json(seenMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Internal Error,', { status: 500 });
  }
}

/**
 * For the current user, mark conversation as caught up.
 */
async function notifySelfCaughtUpOnConversation(updatedConversation: ConversationWithUsers, user: User) {
  if (user.email) {
    await pusherServer.trigger(user.email, 'conversation:update', updatedConversation.id);
  }
}

async function notifyReadersSeenMessage(conversation: ConversationWithUsers, seenMessage: Message) {
  await pusherServer.trigger(conversation.id, 'message:update', seenMessage.id);
}
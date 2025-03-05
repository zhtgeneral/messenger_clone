import { Conversation, Message, User } from "@prisma/client";
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher'

type ConversationWithUsers = Conversation & {
  users: User[]
}


/**
 * This API endpoint handles adding new messages.
 * 
 * It checks that the current user has a `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * Create the message in the database.
 * 
 * Anyone on the conversation page will see the message appear in real time.
 * Every member will see a new conversation in their sidebar.
 * 
 * Then return a `200` response for `"OK"`.
 * 
 * If any other error occurs, throw a `500` error for internal error 
 * and console log it under `ERROR_MESSAGES_POST`.
 * 
 * @param request a request with `message`, `image`, `conversationId`
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      image,
      conversationId
    } = body;
    
    if (!currentUser?.id || !currentUser?.email)  {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse('Missing conversationId', { status: 400 });
    }
    if (!message && !image) {
      return new NextResponse('message or image required ', { status: 400 });
    }
    
    const newMessage = await prisma.message.create({
      data: {
        body : message,
        image: image,
        conversation: {
          connect: {
            id: conversationId
          }
        },
        sender: {
          connect: {
            id: currentUser.id
          }
        },
        seen: {
          connect: {
            id: currentUser.id
          }
        }, 
      },
      include: {
        seen: true,
        sender: true,
      }
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages : {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true
          }
        }
      }
    });

    const notifications = [
      notifyReadersNewMessage(updatedConversation, newMessage), 
      notifySelfSeenMessage(updatedConversation, newMessage),
      notifyMembersUpdatedConversation(updatedConversation)
    ];
    await Promise.all(notifications);

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'POST /api/messages ERROR_MESSAGES_POST')
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * For anyone on the conversation page, display the new message.
 */
async function notifyReadersNewMessage(updatedConversation: ConversationWithUsers, newMessage: Message) {
  try {
    await pusherServer.trigger(updatedConversation.id, 'messages:new', newMessage.id);
  } catch (error: unknown) {
    console.log(error, 'POST /api/messages ERROR_MESSAGES_CREATE');
  }
}

/**
 * For ourselves, we mark the message as seen to not trigger unreads.
 */
async function notifySelfSeenMessage(conversation: ConversationWithUsers, newMessage: Message) {
  try {
    await pusherServer.trigger(conversation.id, 'messages:update', newMessage.id);
  } catch (error: unknown) {
    console.log(error, 'POST /api/messages ERROR_MESSAGES_SEEN');
  }
}

/**
 * For every member of the conversation, update their sidebar for new message.
 */
async function notifyMembersUpdatedConversation(updatedConversation: ConversationWithUsers) {
  const updatedNotificationPromises = updatedConversation.users.map((user) => {
    if (user.email) {
      pusherServer.trigger(user.email, 'conversation:update', updatedConversation.id);
    }
  })
  try {
    await Promise.all(updatedNotificationPromises);
  } catch (error: unknown) {
    console.log(error, 'POST /api/messages ERROR_CONVERSATION_NEW_MESSAGE');
  }
}
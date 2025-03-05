import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher'


/**
 * This API endpoint handles adding new messages.
 * 
 * It checks that the current user has a `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * It then creates a message in the database.
 * Then it updates conversation to show the time the conversation was updated at.
 * The conversation is updated to mark the new message as seen for the current user.
 * 
 * Then it notifies everyone in the conversation on channel `messages:new`
 * that a new message was created.
 * This notification is used in the chat display.
 * If an error occurs here, console log it under `ERROR_MESSAGES_RENDER`.
 * 
 * Then it notifies everyone in the conversation on channel `conversation:update`
 * that a new message was created.
 * This notification is used in the sidebar.
 * 
 * If any other error occurs, throw a `500` error for internal error 
 * and console log it under `ERROR_MESSAGES_POST`.
 * 
 * @param request a request with `message`, `image`, `conversationId`
 * @returns a `200` response with the new message
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
      return new NextResponse('Unauthorized', {status: 401});
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
        seen  : true,
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

    // observers get notifications for new messages in real time
    await pusherServer
    .trigger(conversationId, 'messages:new', newMessage.id)
    .catch((error) => console.log(error, 'ERROR_MESSAGES_RENDER'));

    // observers get notifications on the sidebar in real time
    // TODO improve performance by adding promises and awaiting all at oonce.
    updatedConversation.users.map(async (user) => {
      await pusherServer.trigger(user.email!, 'conversation:update', conversationId)
    })

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_POST')
    return new NextResponse('Internal Error', { status: 500 });
  }
}
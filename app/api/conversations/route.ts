import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb' 
import { pusherServer } from "@/app/libs/pusher";


/**
 * This API handles creating new conversations.
 * 
 * It checks that the user who triggered the request has an `id` and `email`. 
 * If not, throw a `401` error for unauthorized.
 * 
 * If the conversation data is marked as a group conversation 
 * but there are no members, not enough members, or missing a conversation name
 * throw a `400` error for invalid data.
 * 
 * If the conversation type is group, create conversation to backend
 * and send updates for each subscriber on channel `conversation:new`. 
 * 
 * If the conversation type isn't group, proceed to get existing conversations.
 * If a previous conversation is found, return the conversation without creating a new one.
 * 
 * If no previous conversation involving the 2 users is found, create a new conversation
 * and send updates for each subscriber on channel `conversation:new`.
 * 
 * If any other error occurs, throw a `500` error for internal error
 * and console log it under `CONVERSATION_POST_ERROR`
 * 
 * @param request the request with `userId`, `isGroup`, `members`, and `name` in the body
 * @returns a `200` response with the new conversation
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body        = await request.json();
    const {
      userId,
      isGroup,
      members,
      name
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid Data', { status: 400 })
    }
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: {value: string}) => ({
                id: member.value
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      });
      // TODO improve performance by loading all promises then await all
      newConversation.users.forEach(async (user) => {
        if (user.email) {
          await pusherServer.trigger(user.email, 'conversation:new', newConversation.id);
        }
      })
      return NextResponse.json(newConversation);
    }
    
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    })

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    // display new conversations on the sidebar
    // TODO improve performance by loading all promises then await all
    newConversation.users.forEach(async (user) => {
      if (user.email) {
        await pusherServer.trigger(user.email, 'conversation:new', newConversation.id);
      }
    })

    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.log(error, 'CONVERSATION_POST_ERROR');
    return new NextResponse('Internal Error', { status: 500 })
  }
}
import { Conversation, User } from "@prisma/client";
import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";

const debugging = false;

type ConversationWithUsers = Conversation & {
  users: User[]
}

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
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (isGroup) {
      if (!members || members.length < 2) {
        return new NextResponse('Group conversations require at least 2 members', { status: 400 });
      }
      if (!name) {
        return new NextResponse('Group conversations require name', { status: 400 });
      }

      const newGroupConversation = await handleGroupChat(name, members, currentUser.id);

      await notifyMembersNewConversation(newGroupConversation);

      return NextResponse.json(newGroupConversation);
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

    await notifyMembersNewConversation(newConversation);
    
    return NextResponse.json(newConversation);
  } catch (error: any) {
    console.log(error, 'POST /api/conversations CONVERSATIONS_CREATE_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * For every member, update their sidebar for new conversation.
 */
async function notifyMembersNewConversation(newConversation: ConversationWithUsers) {
  const notifyConversationPromises = newConversation.users.map((user) => {
    if (user.email) {
      pusherServer.trigger(user.email, 'conversation:new', newConversation.id);
    }
  })
  await Promise.all(notifyConversationPromises); 
}

async function handleGroupChat(name: string, members: any[], userId: string) {
  const newConversation = await prisma.conversation.create({
    data: {
      name: name,
      isGroup: true,
      users: {
        connect: [
          ...members.map((member: { value: string }) => ({
            id: member.value
          })),
          {
            id: userId
          }
        ]
      }
    },
    include: {
      users: true
    }
  });
  return newConversation;
}
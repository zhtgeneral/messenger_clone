import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import { signIn } from "next-auth/react";


interface userData {
  email: string,
  id: string,
  password: string
}

/**
 * This API handles cleanup after running tests.
 * 
 * It gets all user ids associated with input emails.
 * 
 * Then it clears the users from all messages and conversations.
 * This allows users to be deleted and bypass the schema restriction. 
 * 
 * If any other error occurs, throw a `500` for internal error
 * and console log it under `DEV_CLEANUP_ERROR`.
 * 
 * @param request `emails` and `passwords`
 * @returns a `200` response for OK
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { emails, passwords } = body;
    if (!emails || !passwords || passwords.length !== emails.length) {
      return new NextResponse('Invalid data', { status : 400 });
    }
    
    const ids = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { id: true }
    });

    let users: userData[] = [];
    for (let i = 0; i < emails.length; i++) {
      users.push({
        email: emails[i],
        id: ids[i].id,
        password: passwords[i]
      })
    }

    const clearResults = await Promise.all(users.map(async (user) => {
      const [ 
        associatedConversations, 
        associatedMessages
      ] = await Promise.all([
        prisma.conversation.findMany({ where: { userIds: { has: user.id } }}),
        prisma.message.findMany({ where: { senderId: user.id }})
      ])
      const associatedConversationIds = associatedConversations.map(ac => ac.id);
      const associatedMessageIds = associatedMessages.map(ac => ac.id);
      console.log("associatedConversationIds " + JSON.stringify(associatedConversationIds,null,2));
      console.log("associatedMessageIds " + JSON.stringify(associatedMessageIds,null,2));

      prisma.$transaction([
        prisma.conversation.updateMany({
          where: { userIds: { has: user.id } },
          data: { userIds: { set: [] } }
        }),
        prisma.conversation.deleteMany({
          where: { 
            id: { in: associatedConversationIds }
          }
        }),
      ])
      prisma.$transaction([
        prisma.message.updateMany({
          where: { seenIds: { has: user.id } },
          data: { seenIds: { set: [] } }
        }),
        prisma.message.deleteMany({
          where: { 
            id: { in: associatedMessageIds }
          }
        }),
      ])
    }))

    return new NextResponse('OK', { status: 200 });
  } catch (error: any) {
    console.log(error, 'DEV_CLEANUP_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
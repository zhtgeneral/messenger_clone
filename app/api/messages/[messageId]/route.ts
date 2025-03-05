import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

interface IParams {
  messageId: string
}

/**
 * This API end point handles getting a message.
 * @requires params needs to contain the `messageId`.
 * 
 * It checks it the current user has an `id` and `email`.
 * If not throw a `401` error for unauthorized.
 * 
 * Otherwise, return the message from database.
 * 
 * If any error occurs, throw a `500` error for internal error
 * and console log it under `ERROR_MESSAGES_GET`.
 * 
 * @param params the params that contains the messageId
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
    
    const message = await prisma.message.findUnique({
      where: {
        id: params.messageId
      },
      include: {
        seen: true,
        sender: true,
      }
    });
    return NextResponse.json(message);
  } catch (error: any) {
    console.log(error, 'GET /api/messages/:id ERROR_MESSAGES_GET')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
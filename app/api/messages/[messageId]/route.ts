import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

interface IParams {
  messageId: string
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    // const body        = await request.json();
    // const { messageId } = body;
    
    if (!currentUser?.id || !currentUser?.email) 
      return new NextResponse('Unauthorized', {status: 401});
    
    const message = await prisma.message.findUnique({
      where: {
        id: params.messageId
      },
      include: {
        seen  : true,
        sender: true,
      }
    })
    return NextResponse.json(message);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_GET')
    return new NextResponse('Internal Error', {status: 500})
  }
}
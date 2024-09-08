import authOptions from "@/app/libs/authOptions";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// in case I forget where this boilerplate ass code came from
// https://pusher.com/docs/channels/server_api/authenticating-users/
// https://pusher.com/docs/channels/using_channels/presence-channels/

// ends up causing error because NextRequest is needed, not NextApiRequest
export async function POST(
  request: NextRequest,
  response: NextResponse
) {
  const session = await getServerSession(
    request as unknown as NextApiRequest, 
    response as unknown as NextApiResponse, 
    authOptions)
  if (!session?.user?.email)
    return new NextResponse('Unauthorized', { status: 401 })

  const body = await request.json()
  const socketId = body.socket_id;
  const channel = body.channel_name;
  const data = {
    user_id: session.user.email
  }
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data)
  return NextResponse.json(authResponse)
}

export async function GET(
  request: NextRequest,
  response: NextResponse
) {
  const session = await getServerSession(
    request as unknown as NextApiRequest, 
    response as unknown as NextApiResponse, 
    authOptions)
  if (!session?.user?.email)
    return new NextResponse('Unauthorized', { status: 401 })

  const body = await request.json()
  const socketId = body.socket_id;
  const channel = body.channel_name;
  const data = {
    user_id: session.user.email
  }
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data)
  return NextResponse.json(authResponse)
}

// USE PAGES API ROUTE
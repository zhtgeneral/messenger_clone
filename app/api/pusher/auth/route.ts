import getSession from "@/app/actions/getSession";
import { pusherServer } from "@/app/libs/pusher";
import { NextRequest, NextResponse } from "next/server";


/**
 * This API endpoint handles authorizing channels to authenticated users.
 * @requires PusherClient object needs to be created and call this endpoint.
 * 
 * It checks if the current user is logged in. 
 * If not return a `401` response for 'Unauthorized'.
 * 
 * Otherwise it gets the entries from the request 
 * using `application/x-www-form-urlencoded` format
 * and authorizes the current user to recieve updates from channels.
 * 
 * If any other error occurs, console log it under `ERROR_PUSHER_AUTH_POST`
 * and return a `500` response for 'Internal error'.
 * 
 * @link https://pusher.com/docs/channels/server_api/authorizing-users/
 * 
 * @param request the request called by PusherClient
 * @returns a `200` response with the authResponse
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(); 
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rawBody = await request.text();
    const body = Object.fromEntries(new URLSearchParams(rawBody));
  
    const socketId = body.socket_id;
    const channel = body.channel_name;
    const data = {
      user_id: session.user.email
    };
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return NextResponse.json(authResponse);
  } catch (error: unknown) {
    console.log(error + "ERROR_PUSHER_AUTH_POST");
    return new NextResponse("Internal error", { status: 500 });
  }
}
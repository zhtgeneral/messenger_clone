import getSession from "@/app/actions/getSession";
import { pusherServer } from "@/app/libs/pusher";
import { NextRequest, NextResponse } from "next/server";


/**
 * This API endpoint handles authorizing channels to authenticated users.
 * @requires PusherClient object needs to be created and call this endpoint.
 * 
 * It checks if the current user is logged in. 
 * If not return a `403` response for `'Forbidden'`.
 * 
 * Otherwise it gets the entries from the request 
 * and the presence channel gets authorized by PusherServer.
 * 
 * PusherServer signs the auth token for `PusherClient`
 * and a `200` code for `'OK'` is returned.
 * 
 * If any other error occurs, console log it under `ERROR_PUSHER_AUTH_POST`
 * and return a `500` response for `'Internal error'`.
 * 
 * @link https://pusher.com/docs/channels/server_api/authorizing-users/
 * 
 * @param request the auth request called by `PusherClient`
 * @returns a `200` response with the authResponse. This signs the auth request for `PusherClient`
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(); 
    if (!session?.user?.email) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    const rawBody = await request.text();
    const body = Object.fromEntries(new URLSearchParams(rawBody));
    
    const { socket_id, channel_name } = body;
    const data = {
      user_id: session.user.email
    };
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, data);
    return NextResponse.json(authResponse);
  } catch (error: unknown) {
    console.log(error + "ERROR_PUSHER_AUTH_POST");
    return new NextResponse("Internal error", { status: 500 });
  }
}
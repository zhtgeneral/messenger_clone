import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

// in case I forget where this boilerplate ass code came from
// https://pusher.com/docs/channels/server_api/authenticating-users/
// https://pusher.com/docs/channels/using_channels/presence-channels/

// export async function POST(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   const session = await getServerSession(request, response, authOptions)
//   if (!session?.user?.email)
//     return response.status(401)

//   const socketId = request.body.socket_id;
//   const channel = request.body.channel_name;
//   const data = {
//     user_id: session.user.email
//   }
//   const authResponse = pusherServer.authorizeChannel(socketId, channel, data)
//   return response.send(authResponse)
// }

// export async function GET(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   const session = await getServerSession(request, response, authOptions)
//   if (!session?.user?.email)
//     return response.status(401)

//   const socketId = request.body.socket_id;
//   const channel = request.body.channel_name;
//   const data = {
//     user_id: session.user.email
//   }
//   const authResponse = pusherServer.authorizeChannel(socketId, channel, data)
//   return response.send(authResponse)
// }

// TODO REMOVE SINCE REQUEST CAN'T BE FOUND HERE
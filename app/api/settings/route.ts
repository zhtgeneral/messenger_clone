import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server"
import prisma from '@/app/libs/prismadb';

/**
 * This API endpoint handles updating a user's info.
 * Only name and pfp can be updated for now.
 * 
 * It checks if the current user has a `id` and `email`.
 * If not, throw a `401` error for unauthorized.
 * 
 * Otherwise update the user's info in the database and returns it.
 * 
 * If any other error occurs, throw a `500` error for internal error
 * and console log it under `ERROR_SETTINGS`.
 * 
 * @param request the request with `name` and `image`
 * @returns a `200` response with the updated user
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {name, image} = body;
    
    if (!currentUser) {
      return new NextResponse('Unauthorized', {status: 401})
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      }
    })
    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.log(error, 'ERROR_SETTINGS')
    return new NextResponse('Internal Error', {status: 500})
  }
}
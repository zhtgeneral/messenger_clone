import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb' 
import getSession from "@/app/actions/getSession";

/**
 * This API handles creating a user.
 * 
 * It checks if the body of the request had `email`, `name`, `password`.
 * If not, it throws a `400` error for invalid data.
 * 
 * Otherwise, it encrypts the password and uploads it to the database and returns it.
 * 
 * If any other error occurs, throw a `500` for internal error
 * and console log it under `REGISRATION_POST_ERROR`.
 * 
 * @param request the data of the user with `email`, `name`, `password`
 * @returns a `200` response with the user object
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email, 
      name, 
      password
    } = body;
    if (!email || !name || !password) {
      return new NextResponse('Invalid data', { status : 400 });
    }

    const hashedPassword  = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email, 
        name,
        hashedPassword
      }
    })
    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, 'REGISRATION_POST_ERROR');
    return new NextResponse('Internal Error', { status: 500 })
  }
}

/**
 * This API handles deleting a user.
 * 
 * @requires currentUser needs to be logged in.
 * 
 * It checks if the user is authenticated.
 * If not, it throws a `401` error for unauthorized.
 * 
 * Otherwise, it finds the user from the database using email.
 * If email is missing, throw a 400 error for invalid data.
 * 
 * Otherwise it deletes the user from the database and returns it.
 * 
 * If any other error occurs, throw a `500` for internal error
 * and console log it under `REGISRATION__DELETE_ERROR`.
 * 
 * @param request the data of the user with `email`
 * @returns a `200` response with the user object
 */
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status : 401 });
    }
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return new NextResponse('Invalid data', { status : 400 });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        email
      }
    })
    return NextResponse.json(deletedUser);
  } catch (error: any) {
    console.log(error, 'REGISRATION_DELETE_ERROR');
    return new NextResponse('Internal Error', { status: 500 })
  }
}
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb' 

/**
 * This API handles creating a user.
 * 
 * It checks if the body of the request had `email`, `name`, `password`.
 * If not, it throws a `400` error for invalid data.
 * 
 * Otherwise, it encrypts the password and uploads it to the database and returns it.
 * 
 * If any other error occurs, throw a `500` for internal error
 * and console log it under `REGISRATION_ERROR`.
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
    console.log(error, 'REGISRATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 })
  }
}
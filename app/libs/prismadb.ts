import { PrismaClient } from "@prisma/client";


// I wish I knew where to get this from (to copy and paste of course)
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
declare global {
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV != 'production') globalThis.prisma = client;

export default client
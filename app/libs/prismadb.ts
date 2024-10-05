import { PrismaClient } from "@prisma/client";

/**
 * Creates prisma as a global variable that can be accessed anywhere.
 * 
 * @link https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
 */
declare global {
  var prisma: PrismaClient | undefined
}

/**
 * Single object of prisma client
 */
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV != 'production') globalThis.prisma = client;

export default client
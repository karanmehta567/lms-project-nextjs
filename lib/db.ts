// lib/prisma.ts
import 'server-only'
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // adapter for Postgres

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!, // or pass config object the adapter expects
});

export const prisma = new PrismaClient({ adapter });
export default prisma;

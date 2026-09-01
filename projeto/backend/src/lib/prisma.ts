import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  adapter?: PrismaPg;
  pool?: Pool;
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL deve estar configurada para inicializar o Prisma.",
  );
}

const pool =
  globalForPrisma.pool ?? new Pool({ connectionString: databaseUrl });
const adapter = globalForPrisma.adapter ?? new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = adapter;
  globalForPrisma.prisma = prisma;
}

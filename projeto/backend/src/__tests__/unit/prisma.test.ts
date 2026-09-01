import { afterEach, describe, expect, it, vi } from "vitest";

const constructors = vi.hoisted(() => ({
  adapter: vi.fn(),
  pool: vi.fn(),
  prismaClient: vi.fn(),
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: constructors.adapter,
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: constructors.prismaClient,
}));

vi.mock("pg", () => ({
  Pool: constructors.pool,
}));

interface PrismaGlobalCache {
  adapter?: unknown;
  pool?: unknown;
  prisma?: unknown;
}

const globalCache = globalThis as unknown as PrismaGlobalCache;

const clearPrismaCache = () => {
  delete globalCache.adapter;
  delete globalCache.pool;
  delete globalCache.prisma;
};

describe("singleton Prisma", () => {
  afterEach(() => {
    clearPrismaCache();
    constructors.adapter.mockClear();
    constructors.pool.mockClear();
    constructors.prismaClient.mockClear();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("reutiliza pool, adapter e client durante hot reload em desenvolvimento", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://localhost:5433/kwak_finance");
    vi.stubEnv("NODE_ENV", "development");

    await import("../../lib/prisma");
    vi.resetModules();
    await import("../../lib/prisma");

    expect(constructors.pool).toHaveBeenCalledTimes(1);
    expect(constructors.adapter).toHaveBeenCalledTimes(1);
    expect(constructors.prismaClient).toHaveBeenCalledTimes(1);
  });
});

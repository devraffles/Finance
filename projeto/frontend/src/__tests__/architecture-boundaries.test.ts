import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const frontendSrc = join(process.cwd(), "src");

const forbiddenModules = [
  "@prisma/client",
  "@anthropic-ai/sdk",
  "@ai-sdk/google",
  "ai",
  "backend/src/services",
];

const allowedBackendImportPatterns = [
  /src[\\/]app[\\/]api[\\/]/,
  /src[\\/]lib[\\/]server-session\.ts$/,
];

const sourceExtensions = [".ts", ".tsx"];
const currentTestFile = "architecture-boundaries.test.ts";

const listSourceFiles = (directory: string): string[] => {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return listSourceFiles(path);
    }

    if (
      sourceExtensions.some((extension) => path.endsWith(extension)) &&
      !path.endsWith(currentTestFile)
    ) {
      return [path];
    }

    return [];
  });
};

const hasForbiddenBackendImport = (filePath: string, content: string) => {
  if (!content.includes("@kwak-finance/backend")) {
    return false;
  }

  return !allowedBackendImportPatterns.some((pattern) =>
    pattern.test(filePath),
  );
};

const importsModule = (content: string, moduleName: string) => {
  const escapedModuleName = moduleName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const staticImport = new RegExp(
    `(?:from|import)\\s*[(']\\s*["']${escapedModuleName}["']`,
  );

  return staticImport.test(content);
};

describe("fronteira frontend/backend", () => {
  it("impede SDKs server-side e servicos de dominio no frontend", () => {
    const violations = listSourceFiles(frontendSrc).flatMap((filePath) => {
      const content = readFileSync(filePath, "utf8");
      const directViolations = forbiddenModules.filter((forbiddenModule) => {
        return importsModule(content, forbiddenModule);
      });
      const backendViolation = hasForbiddenBackendImport(filePath, content)
        ? ["@kwak-finance/backend fora de adapter server-side"]
        : [];

      return [...directViolations, ...backendViolation].map((violation) => {
        return `${relative(process.cwd(), filePath).split(sep).join("/")}: ${violation}`;
      });
    });

    expect(violations).toEqual([]);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import { callGemini, GEMINI_API_KEY_ERROR } from "../../lib/gemini";

describe("callGemini", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falha de forma controlada quando GOOGLE_GENERATIVE_AI_API_KEY esta ausente", async () => {
    vi.stubEnv("GOOGLE_GENERATIVE_AI_API_KEY", "");

    await expect(callGemini({ prompt: "Teste" })).rejects.toThrow(
      GEMINI_API_KEY_ERROR,
    );
  });
});

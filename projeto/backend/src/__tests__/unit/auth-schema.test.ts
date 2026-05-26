import { describe, expect, it } from "vitest";

import { authEnvSchema, credentialsSchema } from "../../schemas/auth";

describe("credentialsSchema", () => {
  it("deve aceitar credenciais validas", () => {
    const result = credentialsSchema.safeParse({
      email: "admin@kwakfinance.local",
      password: "admin123",
    });

    expect(result.success).toBe(true);
  });

  it("deve rejeitar email invalido", () => {
    const result = credentialsSchema.safeParse({
      email: "email-invalido",
      password: "admin123",
    });

    expect(result.success).toBe(false);
  });
});

describe("authEnvSchema", () => {
  it("deve exigir secret com tamanho minimo", () => {
    const result = authEnvSchema.safeParse({
      BETTER_AUTH_SECRET: "curto",
      BETTER_AUTH_URL: "http://localhost:3000",
    });

    expect(result.success).toBe(false);
  });
});

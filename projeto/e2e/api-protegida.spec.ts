import { expect, test } from "@playwright/test";

test("API protegida deve exigir autenticacao", async ({ request }) => {
  const response = await request.get("/api/contas");
  const body = await response.json();

  expect(response.status()).toBe(401);
  expect(body.error.code).toBe("UNAUTHORIZED");
});

import { expect, test } from "@playwright/test";

test("deve exibir a tela de login", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
});

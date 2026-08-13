import { expect, test } from "@playwright/test";

test("deve autenticar o usuario seed e abrir o dashboard", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await page.getByLabel("E-mail").fill("admin@kwakfinance.local");
  await page.getByRole("textbox", { name: "Senha" }).fill("admin123");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
});

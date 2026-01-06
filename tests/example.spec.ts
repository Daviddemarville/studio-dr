import { expect, test } from "@playwright/test";

test("a un titre", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Vérifie qu'une page a un titre contenant une sous-chaîne.
  await expect(page).toHaveTitle(/Playwright/);
});

test("lien de démarrage", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Cliquer sur le lien de démarrage.
  await page.getByRole("link", { name: "Get started" }).click();

  // Vérifie que la page a un titre avec le nom de l'Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" }),
  ).toBeVisible();
});

import { expect, test } from "@playwright/test";

/**
 * Tests des Pages Publiques
 * Test du chargement des sections publiques
 */

test.describe("Pages Publiques", () => {
  test("devrait charger la page d'accueil et afficher les sections", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");

    // Vérifier présence de sections communes
    await expect(page.getByRole("heading").first()).toBeVisible();

    // Tester scroll vers sections si elle sont présentes
    const faqLink = page.getByRole("link", { name: /faq|questions/i });
    if (await faqLink.isVisible()) {
      await faqLink.click();
      await expect(page.getByText(/fréquemment|questions/i)).toBeVisible();
    }

    const pricingLink = page.getByRole("link", { name: /tarifs|pricing/i });
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page.getByText("Nos tarifs")).toBeVisible();
    }
  });

  test("devrait permettre la navigation entre sections", async ({ page }) => {
    await page.goto("/");

    // Tester navigation via menu si présent
    const menuItems = page.locator("nav a");
    const count = await menuItems.count();

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = menuItems.nth(i);
        const href = await link.getAttribute("href");
        if (href?.startsWith("#")) {
          await link.click();
          // Vérifier que l'URL contient l'ancre
          await expect(page).toHaveURL(new RegExp(href));
        }
      }
    }
  });
});

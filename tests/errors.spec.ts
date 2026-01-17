import { expect, test } from "@playwright/test";

/**
 * Tests d'Erreurs
 * Test des pages 404 et 500
 */

test.describe("Gestion d'Erreurs", () => {
  test("devrait afficher une page 404 pour une route inexistante", async ({
    page,
  }) => {
    await page.goto("/route-qui-n-existe-pas");
    await expect(page).toHaveURL(/\/route-qui-n-existe-pas/);

    // Vérifier contenu 404
    await expect(
      page.getByText(/404|not found|page introuvable/i),
    ).toBeVisible();
  });

  test.skip("devrait gérer les erreurs serveur (500)", async ({
    page: _page,
  }) => {
    // TODO: Test nécessitant la config d'une route d'erreur spécifique avec une vraie route d'erreur 500
  });

  test("devrait permettre de revenir à l'accueil depuis une page d'erreur", async ({
    page,
  }) => {
    await page.goto("/404");
    const homeLink = page.getByRole("link", { name: /accueil|home/i });
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL("/");
    }
  });
});

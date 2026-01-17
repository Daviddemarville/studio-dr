import { expect, test } from "@playwright/test";

/**
 * Tests du Parcours Critique Utilisateur
 * Test E2E du flux principal: visite site -> inscription -> connexion -> accès admin
 */

test.describe("Parcours Critique Utilisateur", () => {
  test.skip("devrait permettre à un utilisateur de s'inscrire, se connecter et accéder au dashboard admin", async ({
    page: _page,
  }) => {
    // TODO: nécessite configuration auth Supabase réelle
    // Peut être réactivé avec credentials de test valides mais trop chiant a setup pour le moment avec la validation email etc.
  });

  test("devrait charger la page d'accueil publique correctement", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading").first()).toBeVisible();
    await expect(page.getByText("Studio DR").first()).toBeVisible();
  });
});

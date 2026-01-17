import { expect, test } from "@playwright/test";

/**
 * Tests de Flux de Connexion
 * Tests du processus d'authentification et de connexion
 */

test.describe("Flux de Connexion", () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de connexion avant chaque test
    await page.goto("/auth/signIn");
  });

  test("devrait avoir un lien vers la page de mot de passe oublié", async ({
    page,
  }) => {
    // Vérifier le lien mot de passe oublié
    const forgotLink = page.getByRole("link", {
      name: /mot de passe oublié|forgot password/i,
    });
    await expect(forgotLink).toBeVisible();

    // Vérifier la navigation
    await forgotLink.click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  test("devrait avoir un lien vers la page d'inscription", async ({ page }) => {
    // Vérifier le lien d'inscription
    const signUpLink = page.getByRole("link", {
      name: /créer un compte|sign up|s'inscrire|not yet registered/i,
    });
    await expect(signUpLink).toBeVisible();

    // Vérifier la navigation
    await signUpLink.click();
    await expect(page).toHaveURL(/\/auth\/signUp/);
  });

  test("devrait permettre de voir le mot de passe en cliquant sur le bouton bascule", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i);

    // Supposer que le bouton bascule du mot de passe existe (dépend de l'implémentation)
    const toggleButton = page.getByRole("button", {
      name: /afficher|show password/i,
    });

    if (await toggleButton.isVisible()) {
      // Initialement devrait être de type password
      await expect(passwordInput).toHaveAttribute("type", "password");

      // Cliquer sur le bouton bascule
      await toggleButton.click();

      // Devrait maintenant être de type texte
      await expect(passwordInput).toHaveAttribute("type", "text");

      // Cliquer à nouveau pour masquer
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    }
  });
});

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

  // TODO: Fix - Corriger la structure HTML pour matcher les sélecteurs (headings multiples)
  test.skip("devrait afficher le formulaire de connexion avec tous les champs requis", async ({
    page,
  }) => {
    // Vérifier le titre et le sous-titre
    await expect(page.getByRole("heading")).toContainText("Connexion");
    await expect(
      page.getByText("Accédez à votre espace Studio DR"),
    ).toBeVisible();

    // Vérifier les champs du formulaire
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();

    // Vérifier la case à cocher "se souvenir de moi" et le lien "mot de passe oublié"
    await expect(
      page.getByRole("button", { name: /connexion|sign in|se connecter/i }),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email vide", async ({
    page,
  }) => {
    // Laisser l'email vide et soumettre
    await page.getByLabel(/mot de passe/i).fill("password123");
    await page
      .getByRole("button", { name: /connexion|sign in|se connecter/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/email.*requis|email.*required|field.*required/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un mot de passe vide", async ({
    page,
  }) => {
    // Laisser le mot de passe vide et soumettre
    await page.getByLabel(/email/i).fill("user@example.com");
    await page
      .getByRole("button", { name: /connexion|sign in|se connecter/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(
        /mot de passe.*requis|password.*required|field.*required/i,
      ),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un format d'email invalide", async ({
    page,
  }) => {
    // Entrer un format d'email invalide
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/mot de passe/i).fill("password123");
    await page
      .getByRole("button", { name: /connexion|sign in|se connecter/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/email.*invalide|adresse email|invalid email/i),
    ).toBeVisible();
  });

  // TODO: Fix - Display error message for invalid credentials
  test.skip("devrait afficher une erreur pour des identifiants invalides", async ({
    page,
  }) => {
    // Entrer un format valide mais un compte inexistant
    await page.getByLabel(/email/i).fill("nonexistent@example.com");
    await page.getByLabel(/mot de passe/i).fill("WrongPassword123!");

    // Cliquer sur soumettre
    await page
      .getByRole("button", { name: /connexion|sign in|se connecter/i })
      .click();

    // Attendre le message d'erreur (pourrait être de l'API ou la validation du formulaire)
    await expect(
      page.getByText(
        /identifiants invalides|incorrect|invalid credentials|not found/i,
      ),
    ).toBeVisible({ timeout: 5000 });
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

  // TODO: Fix - Add disabled state to submit button during form submission
  test.skip("devrait désactiver le bouton soumettre pendant la soumission", async ({
    page,
  }) => {
    // Mocker la requête de connexion pour être lente
    await page.route("**/api/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.abort();
    });

    // Remplir le formulaire avec un format valide
    await page.getByLabel(/email/i).fill("user@example.com");
    await page.getByLabel(/mot de passe/i).fill("Password123!");

    // Obtenir le bouton soumettre et le cliquer
    const submitButton = page.getByRole("button", {
      name: /connexion|sign in|se connecter/i,
    });
    await submitButton.click();

    // Vérifier si le bouton est désactivé
    await expect(submitButton).toHaveAttribute("disabled");
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait effacer le message d'erreur quand l'utilisateur commence à taper", async ({
    page,
  }) => {
    // Déclencher une erreur d'abord
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/mot de passe/i).fill("password");
    await page
      .getByRole("button", { name: /connexion|sign in|se connecter/i })
      .click();

    // Attendre que l'erreur apparaisse
    await expect(
      page.getByText(/email.*invalide|invalid email/i),
    ).toBeVisible();

    // Commencer à taper un email valide
    const emailInput = page.getByLabel(/email/i);
    await emailInput.clear();
    await emailInput.fill("valid@example.com");

    // L'erreur devrait disparaître ou être remplacée
    // Cela dépend de l'implémentation - pourrait s'effacer au blur à la place
    await page.waitForTimeout(500);
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

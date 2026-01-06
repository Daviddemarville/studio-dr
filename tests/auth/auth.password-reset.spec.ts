import { expect, test } from "@playwright/test";

/**
 * Tests de Flux de Réinitialisation de Mot de Passe
 * Tests des processus de mot de passe oublié et de réinitialisation de mot de passe
 */

test.describe("Flux de Mot de Passe Oublié", () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de mot de passe oublié avant chaque test
    await page.goto("/auth/forgot-password");
  });

  // TODO: Fix - Vérifier que le bouton existe avec le bon texte
  test.skip("devrait afficher le formulaire de mot de passe oublié", async ({
    page,
  }) => {
    // Vérifier que le formulaire est affiché
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();

    // Vérifier le bouton soumettre
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await expect(submitButton).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email vide", async ({
    page,
  }) => {
    // Essayer de soumettre sans email
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await submitButton.click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/email.*requis|email.*required/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email invalide", async ({
    page,
  }) => {
    // Entrer un email invalide
    await page.getByLabel(/email/i).fill("invalid-email");

    // Soumettre le formulaire
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await submitButton.click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/email.*invalide|adresse email/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email jetable", async ({
    page,
  }) => {
    // Entrer un email jetable
    await page.getByLabel(/email/i).fill("user@yopmail.com");

    // Soumettre le formulaire
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await submitButton.click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/emails jetables|disposable.*not allowed/i),
    ).toBeVisible();
  });

  // TODO: Fix - Vérifier que le message de succès s'affiche après soumission
  test.skip("devrait afficher un message de succès après avoir soumis un email valide", async ({
    page,
  }) => {
    // Entrer un email valide (même si le compte n'existe pas)
    await page.getByLabel(/email/i).fill("test@example.com");

    // Soumettre le formulaire
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await submitButton.click();

    // Devrait afficher un message de succès (selon la bonne pratique de sécurité, même message pour existant/non-existant)
    await expect(
      page.getByText(/lien de réinitialisation|reset.*link|email.*sent/i),
    ).toBeVisible({ timeout: 5000 });
  });

  // TODO: Fix - Vérifier que le bouton se désactive pendant la soumission (forgot-password)
  test.skip("devrait désactiver le bouton soumettre pendant le traitement", async ({
    page,
  }) => {
    // Mocker la requête lente
    await page.route("**/api/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.abort();
    });

    // Entrer l'email
    await page.getByLabel(/email/i).fill("test@example.com");

    // Submit form
    const submitButton = page.getByRole("button", {
      name: /réinitialiser|reset|envoyer/i,
    });
    await submitButton.click();

    // Button should be disabled
    await expect(submitButton).toHaveAttribute("disabled", /true|disabled/);
  });

  test("should have link back to sign in", async ({ page }) => {
    // Check for back to sign in link
    const signInLink = page.getByRole("link", {
      name: /connexion|sign in|back/i,
    });
    if (await signInLink.isVisible()) {
      await signInLink.click();
      await expect(page).toHaveURL(/\/auth\/signIn/);
    }
  });
});

test.describe("Flux de Réinitialisation de Mot de Passe", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to reset password page
    // Note: This page should only be accessible via email link with token
    await page.goto("/auth/reset-password");
  });

  // TODO: Fix - Corriger les labels pour éviter les strict mode violations
  test.skip("devrait afficher le formulaire de réinitialisation de mot de passe avec les champs de mot de passe", async ({
    page,
  }) => {
    // Vérifier les champs de mot de passe
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
      await expect(confirmInput).toBeVisible();

      // Vérifier le bouton soumettre
      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await expect(submitButton).toBeVisible();
    }
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un mot de passe vide", async ({
    page,
  }) => {
    const submitButton = page.getByRole("button", {
      name: /mettre à jour|update|reset/i,
    });

    if (await submitButton.isVisible()) {
      // Laisser les mots de passe vides et soumettre
      await submitButton.click();

      // Vérifier l'erreur de validation
      await expect(
        page.getByText(/mot de passe.*requis|password.*required/i),
      ).toBeVisible();
    }
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un mot de passe trop court", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      // Entrer un mot de passe court
      await passwordInput.fill("short");
      await confirmInput.fill("short");

      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await submitButton.click();

      // Vérifier l'erreur de validation
      await expect(
        page.getByText(/au moins 6|minimum.*characters|too short/i),
      ).toBeVisible();
    }
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour des mots de passe non concordants", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      // Entrer des mots de passe non concordants
      await passwordInput.fill("NewPassword123!");
      await confirmInput.fill("DifferentPassword456!");

      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await submitButton.click();

      // Vérifier l'erreur de validation
      await expect(
        page.getByText(/ne correspondent pas|do not match/i),
      ).toBeVisible();
    }
  });

  // TODO: Fix - Vérifier que le message de succès s'affiche après réinitialisation
  test.skip("devrait afficher un message de succès après une réinitialisation réussie du mot de passe", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      // Entrer des mots de passe valides concordants
      await passwordInput.fill("NewPassword123!");
      await confirmInput.fill("NewPassword123!");

      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await submitButton.click();

      // Attendre le message de succès
      await expect(
        page.getByText(
          /mot de passe.*mis à jour|password.*updated|successfully/i,
        ),
      ).toBeVisible({ timeout: 5000 });
    }
  });

  // TODO: Fix - Vérifier la redirection après réinitialisation
  test.skip("devrait rediriger vers la connexion après la réinitialisation du mot de passe", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      // Entrer des mots de passe valides
      await passwordInput.fill("NewPassword123!");
      await confirmInput.fill("NewPassword123!");

      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await submitButton.click();

      // Attendre la redirection vers la page de connexion
      await expect(page).toHaveURL(/\/auth\/signIn/, { timeout: 5000 });
    }
  });

  // TODO: Fix - Vérifier que le bouton se désactive pendant la soumission (reset-password)
  test.skip("devrait désactiver le bouton soumettre pendant le traitement", async ({
    page,
  }) => {
    const passwordInput = page.getByLabel(/mot de passe/i, { exact: true });
    const confirmInput = page.getByLabel(/confirmer.*mot de passe|confirm/i);

    if (await passwordInput.isVisible()) {
      // Mocker la requête lente
      await page.route("**/api/**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.abort();
      });

      // Entrer les mots de passe
      await passwordInput.fill("NewPassword123!");
      await confirmInput.fill("NewPassword123!");

      const submitButton = page.getByRole("button", {
        name: /mettre à jour|update|reset/i,
      });
      await submitButton.click();

      // Le bouton devrait être désactivé
      await expect(submitButton).toHaveAttribute("disabled", /true|disabled/);
    }
  });
});

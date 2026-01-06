import { expect, test } from "@playwright/test";

/**
 * Tests de Flux d'Inscription
 * Tests du processus d'enregistrement complet avec validation
 */

test.describe("Flux d'Inscription", () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page d'inscription avant chaque test
    await page.goto("/auth/signUp");
  });

  // TODO: Fix - Corriger la structure HTML pour matcher les sélecteurs (headings multiples)
  test.skip("devrait afficher le formulaire d'inscription avec tous les champs requis", async ({
    page,
  }) => {
    // Vérifier le titre et le sous-titre
    await expect(page.getByRole("heading")).toContainText("Creer un compte");
    await expect(
      page.getByText("Accédez à votre espace Studio DR"),
    ).toBeVisible();

    // Vérifier les champs du formulaire
    await expect(page.getByLabel(/prénom/i)).toBeVisible();
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/pseudo/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(
      page.getByLabel(/mot de passe/i, { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel(/confirmer.*mot de passe/i)).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email invalide", async ({
    page,
  }) => {
    // Remplir le formulaire avec un email invalide
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("invalid-email");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/email.*invalide|adresse email/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un prénom invalide", async ({
    page,
  }) => {
    // Remplir le formulaire avec un prénom invalide (trop court)
    await page.getByLabel(/prénom/i).fill("A");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("jean@example.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/prénom.*au moins 3|doit contenir/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour des mots de passe non concordants", async ({
    page,
  }) => {
    // Remplir le formulaire avec des mots de passe non concordants
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("jean@example.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("DifferentPass456!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/mots de passe.*ne correspondent pas|password.*match/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un email jetable", async ({
    page,
  }) => {
    // Remplir le formulaire avec un email jetable
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("user@yopmail.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/emails jetables.*non autorisés|disposable.*not allowed/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour un pseudo invalide", async ({
    page,
  }) => {
    // Remplir le formulaire avec un pseudo invalide (contient des accents)
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("jean@example.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(
      page.getByText(/pseudo|caractères autorisés|format/i),
    ).toBeVisible();
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher une erreur de validation pour des mots interdits dans le pseudo", async ({
    page,
  }) => {
    // Remplir le formulaire avec un mot interdit dans le pseudo
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("admin");
    await page.getByLabel(/email/i).fill("jean@example.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Soumettre le formulaire
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Vérifier l'erreur de validation
    await expect(page.getByText(/mot interdit|banned.*word/i)).toBeVisible();
  });

  // TODO: Fix - Vérifier que le lien existe dans le formulaire d'inscription
  test.skip("devrait avoir un lien vers la page de connexion", async ({
    page,
  }) => {
    // Vérifier le lien de connexion
    const signInLink = page.getByRole("link", {
      name: /connexion|sign in|déjà inscrit/i,
    });
    await expect(signInLink).toBeVisible();

    // Vérifier la navigation
    await signInLink.click();
    await expect(page).toHaveURL(/\/auth\/signIn/);
  });

  // TODO: Fix - Vérifier que le bouton se désactive pendant la soumission
  test.skip("devrait désactiver le bouton soumettre pendant la soumission", async ({
    page,
  }) => {
    // Mocker la requête d'inscription pour être lente
    await page.route("**/api/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.abort();
    });

    // Remplir le formulaire avec des données valides
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("jean@example.com");
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("SecurePass123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("SecurePass123!");

    // Obtenir le bouton soumettre et le cliquer
    const submitButton = page.getByRole("button", {
      name: /créer|sign up|s'inscrire/i,
    });
    await submitButton.click();

    // Vérifier si le bouton est désactivé (attribut aria-busy ou disabled)
    await expect(submitButton).toHaveAttribute("disabled", "");
  });
});

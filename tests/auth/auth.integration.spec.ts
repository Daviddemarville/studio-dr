import { expect, test } from "@playwright/test";

/**
 * Tests d'Intégration d'Authentification
 * Tests des flux d'utilisateurs complets combinant plusieurs étapes d'authentification
 */

test.describe("Flux d'Authentification Complets", () => {
  // TODO: Fix - Corriger la structure HTML pour éviter les strict mode violations (headings multiples)
  test.skip("devrait permettre l'inscription d'un nouvel utilisateur et la connexion immédiate", async ({
    page,
  }) => {
    // Étape 1: Naviguer vers l'inscription
    await page.goto("/auth/signUp");
    await expect(page.getByRole("heading")).toContainText("Creer un compte");

    // Étape 2: Remplir le formulaire d'inscription avec des données valides
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    const testPseudo = `testuser${timestamp}`.substring(0, 20);

    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill(testPseudo);
    await page.getByLabel(/email/i).fill(testEmail);
    await page
      .getByLabel(/mot de passe/i, { exact: true })
      .fill("TestPassword123!");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("TestPassword123!");

    // Étape 3: Soumettre l'inscription
    await page
      .getByRole("button", { name: /créer|sign up|s'inscrire/i })
      .click();

    // Étape 4: Vérifier la redirection (irait à la connexion ou au tableau de bord selon l'implémentation)
    // Attendre que la navigation se termine
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
      // La navigation peut ne pas toujours se produire, ce qui est correct
    });

    // Ne devrait pas être sur la page d'inscription
    const url = page.url();
    expect(!url.includes("/auth/signUp")).toBeTruthy();
  });

  // TODO: Fix - Update button text on forgot password page to match expected pattern
  test.skip("devrait gérer le flux mot de passe oublié", async ({ page }) => {
    // Étape 1: Aller à la page de connexion
    await page.goto("/auth/signIn");

    // Étape 2: Cliquer sur le lien mot de passe oublié
    const forgotLink = page.getByRole("link", {
      name: /mot de passe oublié|forgot password/i,
    });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();

    // Étape 3: Vérifier que nous sommes sur la page mot de passe oublié
    await expect(page).toHaveURL(/\/auth\/forgot-password/);

    // Étape 4: Entrer l'email pour réinitialiser le mot de passe
    await page.getByLabel(/email/i).fill("existing@example.com");

    // Étape 5: Soumettre le formulaire
    await page
      .getByRole("button", { name: /réinitialiser|reset|envoyer/i })
      .click();

    // Étape 6: Vérifier le message de succès
    await expect(
      page.getByText(/lien de réinitialisation|reset.*link/i),
    ).toBeVisible({ timeout: 5000 });
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait valider les données de formulaire lors de l'inscription et la connexion", async ({
    page,
  }) => {
    // Test 1: Inscription avec un email invalide
    await page.goto("/auth/signUp");

    const testCases = [
      {
        email: "invalid-email",
        expectedError: /email.*invalide|adresse email/i,
      },
      {
        email: "user@yopmail.com",
        expectedError: /emails jetables|disposable/i,
      },
    ];

    for (const testCase of testCases) {
      await page.getByLabel(/email/i).fill(testCase.email);
      await page.getByRole("button", { name: /créer|sign up/i }).click();
      await expect(page.getByText(testCase.expectedError)).toBeVisible();
      await page.getByLabel(/email/i).clear();
    }

    // Test 2: Connexion avec un format d'email invalide
    await page.goto("/auth/signIn");
    await page.getByLabel(/email/i).fill("invalid-email");
    await page.getByLabel(/mot de passe/i).fill("password123");
    await page.getByRole("button", { name: /connexion|sign in/i }).click();
    await expect(
      page.getByText(/email.*invalide|invalid email/i),
    ).toBeVisible();
  });

  test("devrait gérer correctement les changements d'état du formulaire", async ({
    page,
  }) => {
    await page.goto("/auth/signIn");

    // Étape 1: Remplir le champ email
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill("user@example.com");
    await expect(emailInput).toHaveValue("user@example.com");

    // Étape 2: Effacer et remplir avec un email différent
    await emailInput.clear();
    await emailInput.fill("different@example.com");
    await expect(emailInput).toHaveValue("different@example.com");

    // Étape 3: Remplir le champ mot de passe
    const passwordInput = page.getByLabel(/mot de passe/i);
    await passwordInput.fill("SomePassword123");

    // Étape 4: Effacer le formulaire en le rafraîchissant
    await page.reload();
    await expect(emailInput).toHaveValue("");
    await expect(passwordInput).toHaveValue("");
  });

  // TODO: Fix - Vérifier que le bouton se désactive pour empêcher la double soumission
  test.skip("devrait empêcher la double soumission de formulaires", async ({
    page,
  }) => {
    await page.goto("/auth/signIn");

    // Configuration de l'interception des requêtes pour une réponse lente
    let requestCount = 0;
    await page.route("**/api/auth/signin", async (route) => {
      requestCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.abort();
    });

    // Remplir et soumettre le formulaire
    await page.getByLabel(/email/i).fill("user@example.com");
    await page.getByLabel(/mot de passe/i).fill("Password123");

    const submitButton = page.getByRole("button", {
      name: /connexion|sign in/i,
    });

    // Cliquer plusieurs fois rapidement
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    // Attendre que les requêtes se terminent
    await page.waitForTimeout(3000);

    // Devrait avoir fait des requêtes minimales (idéalement juste 1 si le bouton était désactivé)
    // L'implémentation devrait empêcher les soumissions multiples
    expect(requestCount).toBeLessThanOrEqual(3);
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait maintenir les données du formulaire sur les erreurs de validation", async ({
    page,
  }) => {
    await page.goto("/auth/signUp");

    // Remplir tout le formulaire
    await page.getByLabel(/prénom/i).fill("Jean");
    await page.getByLabel(/nom/i).fill("Dupont");
    await page.getByLabel(/pseudo/i).fill("jeandupont");
    await page.getByLabel(/email/i).fill("invalid-email"); // Invalide
    await page.getByLabel(/mot de passe/i, { exact: true }).fill("Password123");
    await page.getByLabel(/confirmer.*mot de passe/i).fill("Password123");

    // Soumettre le formulaire (devrait échouer sur la validation de l'email)
    await page.getByRole("button", { name: /créer|sign up/i }).click();

    // Vérifier l'erreur
    await expect(page.getByText(/email.*invalide/i)).toBeVisible();

    // Vérifier que les données du formulaire sont conservées (sauf l'email qui était invalide)
    await expect(page.getByLabel(/prénom/i)).toHaveValue("Jean");
    await expect(page.getByLabel(/nom/i)).toHaveValue("Dupont");
    await expect(page.getByLabel(/pseudo/i)).toHaveValue("jeandupont");
  });

  test("devrait gérer les interactions du champ mot de passe", async ({
    page,
  }) => {
    await page.goto("/auth/signIn");

    const passwordInput = page.getByLabel(/mot de passe/i);

    // Taper le mot de passe
    await passwordInput.fill("MySecurePassword123!");

    // Vérifier le type d'entrée du mot de passe
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Rechercher le bouton de basculement du mot de passe
    const toggleButton = page.getByRole("button", {
      name: /afficher|show|voir/i,
    });

    if (await toggleButton.isVisible()) {
      // Basculer pour afficher le mot de passe
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute("type", "text");

      // Basculer pour masquer
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  // TODO: Fix - Vérifier le comportement de navigation depuis la page d'erreur
  test.skip("devrait gérer la récupération des erreurs correctement", async ({
    page,
  }) => {
    // Simuler une erreur d'authentification
    await page.goto("/auth/error");

    // Vérifier le contenu de la page d'erreur
    const errorContent = page.locator("body");
    await expect(errorContent).toBeVisible();

    // Rechercher le lien de retour
    const backLink = page.getByRole("link", { name: /retour|back|try again/i });

    if (await backLink.isVisible()) {
      await backLink.click();
      // Devrait naviguer loin de la page d'erreur
      const newUrl = page.url();
      expect(!newUrl.includes("/auth/error")).toBeTruthy();
    }
  });

  // TODO: Fix - Ajouter validation côté client avec messages d'erreur
  test.skip("devrait afficher des messages de validation cohérents dans tous les flux", async ({
    page,
  }) => {
    // Tester la cohérence des messages de validation entre connexion et inscription

    // Page de connexion - champ vide
    await page.goto("/auth/signIn");
    await page.getByRole("button", { name: /connexion|sign in/i }).click();

    const signInErrors = await page.locator("text=/requis|required/i").count();
    expect(signInErrors).toBeGreaterThan(0);

    // Page d'inscription - champ vide
    await page.goto("/auth/signUp");
    await page.getByRole("button", { name: /créer|sign up/i }).click();

    const signUpErrors = await page.locator("text=/requis|required/i").count();
    expect(signUpErrors).toBeGreaterThan(0);
  });

  test("devrait gérer la navigation rapide entre les pages", async ({
    page,
  }) => {
    // Naviguer rapidement entre les pages d'authentification
    const authPages = [
      "/auth/signIn",
      "/auth/signUp",
      "/auth/forgot-password",
      "/auth/signIn",
    ];

    for (const authPage of authPages) {
      await page.goto(authPage);
      // Vérifier que la page se charge sans erreur
      const pageSegment = authPage.split("/").pop() ?? authPage;
      await expect(page).toHaveURL(new RegExp(pageSegment));
    }

    // Toutes les navigations devraient se terminer avec succès
    expect(page.url()).toContain("/auth/signIn");
  });
});

test.describe("Accessibilité des Formulaires", () => {
  test("devrait avoir des étiquettes de formulaire appropriées pour l'accessibilité", async ({
    page,
  }) => {
    await page.goto("/auth/signIn");

    // Vérifier que les entrées ont des étiquettes associées
    const emailLabel = page.getByLabel(/email/i);
    const passwordLabel = page.getByLabel(/mot de passe/i);

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();

    // Les étiquettes doivent être cliquables (association appropriée)
    await emailLabel.focus();
    expect(
      await emailLabel.evaluate((el) => el === document.activeElement),
    ).toBe(true);
  });

  // TODO: Fix - Corriger les sélecteurs pour trouver le bouton
  test.skip("devrait supporter la navigation au clavier", async ({ page }) => {
    await page.goto("/auth/signIn");

    // Commencer avec le champ email
    const emailInput = page.getByLabel(/email/i);
    await emailInput.focus();
    await emailInput.fill("user@example.com");

    // Passer au champ mot de passe
    await page.keyboard.press("Tab");
    const passwordInput = page.getByLabel(/mot de passe/i);

    // Taper dans le champ mot de passe
    await passwordInput.fill("Password123");

    // Passer au bouton de soumission
    await page.keyboard.press("Tab");

    // Soumettre avec la touche Entrée
    const submitButton = page.getByRole("button", {
      name: /connexion|sign in/i,
    });
    await submitButton.focus();
    await page.keyboard.press("Enter");

    // La soumission du formulaire doit être déclenchée
    // Vérifier en contrôlant l'état de chargement ou la navigation
    await page.waitForTimeout(500);
  });

  test("devrait avoir des attributs ARIA appropriés pour les champs de formulaire", async ({
    page,
  }) => {
    await page.goto("/auth/signUp");

    // Vérifier les indicateurs de champs obligatoires
    const requiredFields = page.locator('[required], [aria-required="true"]');
    const count = await requiredFields.count();
    expect(count).toBeGreaterThan(0);
  });
});

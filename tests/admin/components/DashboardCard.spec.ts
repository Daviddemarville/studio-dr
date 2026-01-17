import { expect, test } from "@playwright/test";

/**
 * Tests du Composant DashboardCard
 * Tests e2e pour les cartes du tableau de bord dans la page admin
 */

test.describe("Composant DashboardCard", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Authentification requise pour accéder aux pages admin
    // Pour l'instant, nous skippons ces tests jusqu'à ce que l'auth soit configurée
    test.skip(true, "Authentification requise pour les tests admin");

    // Navigation vers la page admin (tableau de bord)
    await page.goto("/admin");
  });

  test.skip("devrait afficher les cartes du tableau de bord avec les bonnes informations", async ({
    page,
  }) => {
    // Vérifier que les cartes du dashboard sont présentes
    const dashboardCards = page.locator(
      '[class*="bg-gray-800/60"][class*="backdrop-blur-sm"]',
    );

    // Il devrait y avoir au moins 3 cartes (sections, utilisateurs, messages)
    await expect(dashboardCards).toHaveCount(3);

    // Vérifier le contenu de chaque carte
    await expect(page.getByText("Sections du site")).toBeVisible();
    await expect(page.getByText("Utilisateurs")).toBeVisible();
    await expect(page.getByText("Messages reçus")).toBeVisible();
  });

  test.skip("devrait afficher les valeurs numériques dans les cartes", async ({
    page,
  }) => {
    // Les cartes devraient contenir des valeurs numériques
    const valueElements = page.locator('[class*="font-bold text-white"]');

    // Vérifier qu'il y a des valeurs affichées (au moins des nombres ou "0")
    const values = await valueElements.allTextContents();
    expect(values.length).toBeGreaterThan(0);

    // Chaque valeur devrait être un nombre ou "0"
    for (const value of values) {
      expect(value.trim()).toMatch(/^\d+$/);
    }
  });

  test.skip("devrait afficher les icônes Lucide dans les cartes", async ({
    page,
  }) => {
    // Vérifier que les icônes sont présentes dans les conteneurs stylés
    const iconContainers = page.locator('[class*="bg-[#3EA1FF]/20"]');

    // Il devrait y avoir autant d'icônes que de cartes
    await expect(iconContainers).toHaveCount(3);

    // Vérifier que chaque conteneur contient une icône SVG
    for (const container of await iconContainers.all()) {
      await expect(container.locator("svg")).toBeVisible();
    }
  });

  test.skip("devrait avoir les effets hover sur les cartes", async ({
    page,
  }) => {
    // Sélectionner la première carte
    const firstCard = page.locator('[class*="bg-gray-800/60"]').first();

    // Vérifier la classe de base (sans hover)
    await expect(firstCard).toHaveClass(/shadow-xl/);

    // TODO: Tester les effets hover nécessiterait de simuler le hover
    // Pour l'instant, on vérifie juste que les classes existent dans le DOM
    const cardClass = await firstCard.getAttribute("class");
    expect(cardClass).toContain("hover:shadow-2xl");
    expect(cardClass).toContain("hover:border-blue-400/40");
  });

  test.skip("devrait afficher les sous-titres quand ils sont présents", async ({
    page,
  }) => {
    // Certains sous-titres peuvent être présents
    const subElements = page.locator('[class*="text-gray-400 mt-1"]');

    // Vérifier que si des sous-titres sont affichés, ils ont le bon style
    const count = await subElements.count();
    if (count > 0) {
      for (const sub of await subElements.all()) {
        await expect(sub).toBeVisible();
      }
    }
  });

  test.skip("devrait avoir le bouton d'aperçu du site", async ({ page }) => {
    // Vérifier que le bouton OpenPreviewButton est présent
    const previewButton = page.getByRole("button", {
      name: /ouvrir dans un nouvel onglet/i,
    });
    await expect(previewButton).toBeVisible();

    // Vérifier qu'il contient l'icône ExternalLink
    await expect(previewButton.locator("svg")).toBeVisible();
  });
});

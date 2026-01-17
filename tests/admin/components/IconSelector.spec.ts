import { expect, test } from "@playwright/test";

/**
 * Tests du Composant IconSelector
 * Tests e2e pour le sélecteur d'icônes dans la page de nouvelle section
 */

test.describe("Composant IconSelector", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Authentification requise pour accéder aux pages admin
    // Pour l'instant, nous skippons ces tests jusqu'à ce que l'auth soit configurée
    test.skip(true, "Authentification requise pour les tests admin");

    // Navigation vers la page de nouvelle section
    await page.goto("/admin/newsection");
  });

  test.skip("devrait afficher le sélecteur d'icônes dans le formulaire", async ({
    page,
  }) => {
    // Vérifier que le label "Icône de la section" est présent
    await expect(page.getByText("Icône de la section")).toBeVisible();

    // Vérifier que la grille d'icônes est affichée
    const iconGrid = page.locator('[class*="grid grid-cols-9"]');
    await expect(iconGrid).toBeVisible();
  });

  test.skip("devrait afficher toutes les icônes disponibles", async ({
    page,
  }) => {
    // Compter les boutons d'icônes (devrait être au moins quelques-uns)
    const iconButtons = page.locator('button[type="button"]').filter({
      has: page.locator("svg"),
    });

    // Il devrait y avoir plusieurs icônes (au moins 5-10 typiquement)
    const count = await iconButtons.count();
    expect(count).toBeGreaterThan(5);

    // Vérifier que chaque bouton contient une icône SVG
    for (const button of await iconButtons.all()) {
      await expect(button.locator("svg")).toBeVisible();
    }
  });

  test.skip("devrait permettre la sélection d'une icône", async ({ page }) => {
    // Sélectionner le premier bouton d'icône
    const firstIconButton = page
      .locator('button[type="button"]')
      .filter({
        has: page.locator("svg"),
      })
      .first();

    // Vérifier qu'il n'est pas sélectionné initialement
    await expect(firstIconButton).not.toHaveClass(/border-blue-500/);

    // Cliquer dessus
    await firstIconButton.click();

    // Maintenant il devrait être sélectionné
    await expect(firstIconButton).toHaveClass(/border-blue-500/);
    await expect(firstIconButton).toHaveClass(/bg-blue-500\/20/);
  });

  test.skip("devrait afficher l'icône sélectionnée en bas", async ({
    page,
  }) => {
    // Sélectionner une icône
    const firstIconButton = page
      .locator('button[type="button"]')
      .filter({
        has: page.locator("svg"),
      })
      .first();

    const iconName = await firstIconButton.getAttribute("title");
    expect(iconName).toBeTruthy();
    await firstIconButton.click();

    // Vérifier que le texte d'icône sélectionnée apparaît
    await expect(page.getByText("Icône sélectionnée :")).toBeVisible();
    if (iconName) {
      await expect(page.getByText(iconName)).toBeVisible();
    }
  });

  test.skip("devrait permettre de changer la sélection d'icône", async ({
    page,
  }) => {
    // Sélectionner deux boutons différents
    const iconButtons = page.locator('button[type="button"]').filter({
      has: page.locator("svg"),
    });

    const firstButton = iconButtons.nth(0);
    const secondButton = iconButtons.nth(1);

    // Sélectionner le premier
    await firstButton.click();
    await expect(firstButton).toHaveClass(/border-blue-500/);
    await expect(secondButton).not.toHaveClass(/border-blue-500/);

    // Sélectionner le deuxième
    await secondButton.click();
    await expect(secondButton).toHaveClass(/border-blue-500/);
    await expect(firstButton).not.toHaveClass(/border-blue-500/);
  });

  test.skip("devrait avoir des attributs title sur chaque bouton", async ({
    page,
  }) => {
    // Vérifier que tous les boutons d'icônes ont un attribut title
    const iconButtons = page.locator('button[type="button"]').filter({
      has: page.locator("svg"),
    });

    for (const button of await iconButtons.all()) {
      const title = await button.getAttribute("title");
      expect(title).toBeTruthy();
      expect(typeof title).toBe("string");
    }
  });

  test.skip("devrait avoir des classes CSS appropriées pour les états", async ({
    page,
  }) => {
    const iconButtons = page.locator('button[type="button"]').filter({
      has: page.locator("svg"),
    });

    // Vérifier les classes des boutons non sélectionnés
    for (const button of await iconButtons.all()) {
      const className = await button.getAttribute("class");
      expect(className).toContain("border-2");
      expect(className).toContain("rounded-lg");
      expect(className).toContain("transition-all");
    }
  });
});

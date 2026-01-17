import { expect, test } from "@playwright/test";

/**
 * Tests du Composant MediaDropzone
 * Tests e2e pour le composant de dépôt de médias dans l'éditeur d'avatar
 */

test.describe("Composant MediaDropzone", () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Authentification requise pour accéder aux pages admin
    // Pour l'instant, nous skippons ces tests jusqu'à ce que l'auth soit configurée
    test.skip(true, "Authentification requise pour les tests admin");

    // Navigation vers la page profil admin
    await page.goto("/admin/profil");
  });

  test.skip("devrait afficher la zone de dépôt quand on clique sur 'Modifier la photo'", async ({
    page,
  }) => {
    // Ouvrir l'éditeur d'avatar
    const editButton = page.getByRole("button", {
      name: /modifier.*photo|edit.*photo/i,
    });
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Vérifier que le modal d'édition d'avatar s'ouvre
    await expect(page.getByText("Modifier la photo")).toBeVisible();

    // Cliquer sur "Modifier la photo"
    const modifyPhotoButton = page.getByRole("button", {
      name: "Modifier la photo",
    });
    await expect(modifyPhotoButton).toBeVisible();
    await modifyPhotoButton.click();

    // Vérifier que la MediaDropzone s'affiche
    await expect(
      page.getByText("Glissez-déposez un fichier ici"),
    ).toBeVisible();
    await expect(page.getByText("ou cliquez pour choisir")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Choisir un fichier" }),
    ).toBeVisible();
  });

  test.skip("devrait permettre de sélectionner un fichier via le bouton", async ({
    page,
  }) => {
    // Ouvrir la MediaDropzone
    await page.getByRole("button", { name: "Modifier la photo" }).click();
    await page.getByRole("button", { name: "Modifier la photo" }).click();

    // Simuler la sélection d'un fichier
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();

    // Créer un fichier de test
    const testFile = {
      name: "test-image.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("fake image content"),
    };

    // Uploader le fichier
    await fileInput.setInputFiles([testFile]);

    // Vérifier que le composant passe à l'étape suivante
    await page.waitForTimeout(1000);
  });

  test.skip("devrait changer l'apparence lors du drag over", async ({
    page,
  }) => {
    // Ouvrir la MediaDropzone
    await page.getByRole("button", { name: "Modifier la photo" }).click();
    await page.getByRole("button", { name: "Modifier la photo" }).click();

    // Obtenir la zone de dépôt
    const dropzone = page.locator('[class*="border border-dashed"]').first();
    await expect(dropzone).toBeVisible();

    // Vérifier la classe initiale (pas de dragging)
    await expect(dropzone).toHaveClass(/bg-neutral-900/);
    await expect(dropzone).toHaveClass(/border-neutral-700/);

    // TODO: Simuler un drag over est complexe avec Playwright
    // Cela nécessiterait de simuler les événements de drag
    // Pour l'instant, on vérifie juste que la zone existe
  });

  test.skip("devrait accepter uniquement les fichiers image par défaut", async ({
    page,
  }) => {
    // Ouvrir la MediaDropzone
    await page.getByRole("button", { name: "Modifier la photo" }).click();
    await page.getByRole("button", { name: "Modifier la photo" }).click();

    // Vérifier que l'input accepte uniquement les images
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute("accept", "image/*");
  });

  test.skip("devrait permettre l'annulation et le retour au menu", async ({
    page,
  }) => {
    // Ouvrir la MediaDropzone
    await page.getByRole("button", { name: "Modifier la photo" }).click();
    await page.getByRole("button", { name: "Modifier la photo" }).click();

    // Vérifier que nous sommes dans l'étape dropzone
    await expect(
      page.getByText("Glissez-déposez un fichier ici"),
    ).toBeVisible();

    // TODO: Ajouter un bouton retour/annuler si nécessaire
    // Pour l'instant, vérifier que le modal peut être fermé
    const closeButton = page.getByRole("button", { name: "✕" });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Vérifier que le modal se ferme
    await expect(
      page.getByText("Glissez-déposez un fichier ici"),
    ).not.toBeVisible();
  });
});

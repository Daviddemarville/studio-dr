import { describe, expect, it } from "@jest/globals";

/**
 * Tests du Composant IconSelector
 * Tests structurels pour le sélecteur d'icônes
 */

describe("Composant IconSelector", () => {
  describe("Structure du Composant", () => {
    it("devrait exister et être accessible", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );

      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it("devrait exporter un composant par défaut", () => {
      const IconSelector =
        require("@/app/(admin)/admin/components/IconSelector").default;
      expect(IconSelector).toBeDefined();
      expect(typeof IconSelector).toBe("function");
    });

    it("devrait être un composant client", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('"use client"');
    });

    it("devrait accepter les props value et onChange", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("value: string");
      expect(content).toContain("onChange: (iconName: string) => void");
    });

    it("devrait utiliser SECTION_ICONS depuis lib/section-icons", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("SECTION_ICONS");
      expect(content).toContain("@/lib/section-icons");
    });

    it("devrait créer une grille de 9 colonnes", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("grid-cols-9");
    });

    it("devrait gérer l'état de sélection avec isSelected", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("isSelected");
      expect(content).toContain("value === iconName");
    });

    it("devrait avoir des classes CSS conditionnelles pour la sélection", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("border-blue-500");
      expect(content).toContain("bg-blue-500/20");
      expect(content).toContain("border-neutral-700");
    });

    it("devrait avoir un attribut title pour chaque bouton", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("title={iconName}");
    });

    it("devrait afficher l'icône sélectionnée en bas", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("Icône sélectionnée :");
      expect(content).toContain("{value}");
    });

    it("devrait avoir du texte en français", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/IconSelector.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("Icône de la section");
      expect(content).toContain("Icône sélectionnée :");
    });
  });
});

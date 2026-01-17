import { describe, expect, it } from "@jest/globals";

/**
 * Tests du Composant TeamVisibilityManager
 * Tests structurels pour le gestionnaire de visibilité d'équipe
 */

describe("Composant TeamVisibilityManager", () => {
  describe("Structure du Composant", () => {
    it("devrait exister et être accessible", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );

      expect(fs.existsSync(componentPath)).toBe(true);
    });

    it("devrait exporter un composant par défaut", () => {
      const TeamVisibilityManager =
        require("@/app/(admin)/admin/components/TeamVisibilityManager").default;
      expect(TeamVisibilityManager).toBeDefined();
      expect(typeof TeamVisibilityManager).toBe("function");
    });

    it("devrait être un composant client", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain('"use client"');
    });

    it("devrait utiliser createClient de Supabase", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("createClient");
      expect(content).toContain("@/lib/supabase-browser");
    });

    it("devrait gérer l'état des utilisateurs avec useState", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("useState<User[]>");
      expect(content).toContain("setUsers");
    });

    it("devrait charger les utilisateurs dans useEffect", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("useEffect");
      expect(content).toContain("loadUsers");
      expect(content).toContain("is_approved");
      expect(content).toContain("true");
    });

    it("devrait avoir une fonction toggleVisibility", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("toggleVisibility");
      expect(content).toContain("is_public");
      expect(content).toContain("update({ is_public");
    });

    it("devrait utiliser react-toastify pour les notifications", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("toast.success");
      expect(content).toContain("toast.error");
    });

    it("devrait afficher un état de chargement", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("Chargement...");
    });

    it("devrait afficher un message quand aucun utilisateur approuvé", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("Aucun utilisateur approuvé");
    });

    it("devrait avoir du texte en français pour l'interface", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const componentPath = path.join(
        process.cwd(),
        "src/app/(admin)/admin/components/TeamVisibilityManager.tsx",
      );
      const content = fs.readFileSync(componentPath, "utf-8");

      expect(content).toContain("Gestion de l'équipe");
      expect(content).toContain("Mon Profil");
      expect(content).toContain("Profil masqué");
      expect(content).toContain("Profil affiché");
      expect(content).toContain("✓ Visible");
      expect(content).toContain("✗ Masqué");
    });
  });
});

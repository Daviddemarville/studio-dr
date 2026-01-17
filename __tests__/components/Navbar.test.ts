import { describe, expect, it } from "@jest/globals";

describe("Composant Navbar", () => {
  it("devrait exporter le composant Navbar par défaut", () => {
    const Navbar = require("@/app/(public)/components/Navbar").default;
    expect(typeof Navbar).toBe("function");
  });

  // Note: Pour des tests de rendu complets, il faudrait @testing-library/react
  // Ce test vérifie simplement que le module s'importe correctement
});

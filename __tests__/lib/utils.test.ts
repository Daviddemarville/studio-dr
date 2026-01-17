import { describe, expect, it } from "@jest/globals";
import { cn } from "@/lib/utils";

/**
 * Tests des Utilitaires Core
 */

describe("Fonction cn", () => {
  it("devrait fusionner les classes Tailwind correctement", () => {
    const result = cn("bg-red-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("devrait gérer les tableaux de classes", () => {
    const result = cn(["bg-red-500", "text-white"], "text-black");
    expect(result).toBe("bg-red-500 text-black");
  });

  it("devrait filtrer les valeurs falsy", () => {
    const result = cn("bg-red-500", null, undefined, "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });
});

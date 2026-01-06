import { describe, expect, it } from "@jest/globals";
import { loginSchema } from "@/lib/zod/loginSchema";
import { registerSchema } from "@/lib/zod/registerSchema";
import {
  emailSchema,
  firstnameSchema,
  lastnameSchema,
  pseudoSchema,
} from "@/lib/zod/user-fields";

/**
 * Tests de Validation du Schéma Zod
 * Tests pour tous les schémas Zod liés à l'authentification
 */

describe("Schéma d'Email", () => {
  it("devrait accepter les adresses e-mail valides", () => {
    const validEmails = [
      "user@example.com",
      "john.doe@company.co.uk",
      "test+alias@domain.org",
      "name123@test-domain.com",
    ];

    validEmails.forEach((email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(true);
    });
  });

  it("devrait rejeter les formats d'email invalides", () => {
    const invalidEmails = [
      "invalid.email",
      "@example.com",
      "user@",
      "user @example.com",
      "user@example",
      "",
    ];

    invalidEmails.forEach((email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(false);
    });
  });

  it("devrait rejeter les domaines d'email jetables", () => {
    const disposableEmails = [
      "user@yopmail.com",
      "test@mailinator.com",
      "test@guerrillamail.com",
      "test@tempmail.com",
      "test@10minutemail.com",
      "test@trashmail.com",
    ];

    disposableEmails.forEach((email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some(
            (issue) =>
              issue.message.includes("jetables") ||
              issue.message.includes("disposable"),
          ),
        ).toBe(true);
      }
    });
  });

  it("devrait convertir l'email en minuscules", () => {
    const result = emailSchema.safeParse("USER@EXAMPLE.COM");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });

  it("devrait supprimer les espaces de l'email", () => {
    const result = emailSchema.safeParse("  user@example.com  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("user@example.com");
    }
  });
});

describe("Schéma de Prénom", () => {
  it("devrait accepter les prénoms valides", () => {
    const validNames = [
      "Jean",
      "Marie-Claire",
      "O'Brien",
      "José",
      "François",
      "Müller",
    ];

    validNames.forEach((name) => {
      const result = firstnameSchema.safeParse(name);
      expect(result.success).toBe(true);
    });
  });

  it("should reject names shorter than 3 characters", () => {
    const shortNames = ["Jo", "Al", "A", ""];

    shortNames.forEach((name) => {
      const result = firstnameSchema.safeParse(name);
      expect(result.success).toBe(false);
    });
  });

  it("should reject names longer than 50 characters", () => {
    const longName = "A".repeat(51);
    const result = firstnameSchema.safeParse(longName);
    expect(result.success).toBe(false);
  });

  it("should reject names with numbers", () => {
    const result = firstnameSchema.safeParse("Jean123");
    expect(result.success).toBe(false);
  });

  it("should reject names with invalid special characters", () => {
    const invalidNames = ["Jean@", "Marie#", "Paul!"];

    invalidNames.forEach((name) => {
      const result = firstnameSchema.safeParse(name);
      expect(result.success).toBe(false);
    });
  });

  it("should trim whitespace", () => {
    const result = firstnameSchema.safeParse("  Jean  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Jean");
    }
  });
});

describe("LastName Schema", () => {
  it("should accept valid last names", () => {
    const validNames = [
      "Dupont",
      "Martin-Garcia",
      "O'Connor",
      "Müller",
      "Søren",
    ];

    validNames.forEach((name) => {
      const result = lastnameSchema.safeParse(name);
      expect(result.success).toBe(true);
    });
  });

  it("should reject names shorter than 2 characters", () => {
    const shortNames = ["A", ""];

    shortNames.forEach((name) => {
      const result = lastnameSchema.safeParse(name);
      expect(result.success).toBe(false);
    });
  });

  it("should accept 2 character names", () => {
    const result = lastnameSchema.safeParse("Jo");
    expect(result.success).toBe(true);
  });

  it("should reject names with numbers", () => {
    const result = lastnameSchema.safeParse("Smith123");
    expect(result.success).toBe(false);
  });
});

describe("Pseudo Schema", () => {
  it("should accept valid pseudo names", () => {
    const validPseudos = [
      "user123", // alphanum
      "john_doe", // with underscore
      "jane-smith", // with dash
      "bob_user_123", // combined (no banned words)
      "", // empty is valid (optional field)
    ];

    validPseudos.forEach((pseudo) => {
      const result = pseudoSchema.safeParse(pseudo);
      if (!result.success) {
        console.error(
          `Pseudo "${pseudo}" failed:`,
          result.error.issues.map((i) => i.message).join(", "),
        );
      }
      expect(result.success).toBe(true);
    });
  });

  it("devrait rejeter les pseudo plus courts que 2 caract\u00e8res", () => {
    const result = pseudoSchema.safeParse("a");
    expect(result.success).toBe(false);
  });

  it("devrait rejeter les pseudo plus longs que 20 caract\u00e8res", () => {
    const longPseudo = "a".repeat(21);
    const result = pseudoSchema.safeParse(longPseudo);
    expect(result.success).toBe(false);
  });

  it("devrait accepter exactement 20 caract\u00e8res de pseudo", () => {
    const pseudoOf20 = "a".repeat(20);
    const result = pseudoSchema.safeParse(pseudoOf20);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter les pseudo avec des accents", () => {
    const result = pseudoSchema.safeParse("üser");
    expect(result.success).toBe(false);
  });

  it("devrait rejeter les pseudo avec des espaces", () => {
    const result = pseudoSchema.safeParse("user name");
    expect(result.success).toBe(false);
  });

  it("devrait rejeter les pseudo avec des mots interdits", () => {
    const bannedWords = ["dev", "test", "admin", "root"];

    bannedWords.forEach((word) => {
      const result = pseudoSchema.safeParse(word);
      // Ces mots exacts interdits devraient être rejetés
      expect(result.success).toBe(false);
    });
  });

  it("devrait rejeter le pseudo contenant des variations de mots interdits", () => {
    const result = pseudoSchema.safeParse("user_admin_test");
    expect(result.success).toBe(false);
  });

  it("devrait accepter le pseudo vide optionnel et retourner une cha\u00eene vide", () => {
    const result = pseudoSchema.safeParse("");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("");
    }
  });

  it("devrait accepter undefined optionnel et retourner une cha\u00eene vide", () => {
    const result = pseudoSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("");
    }
  });
});

describe("Sch\u00e9ma de Connexion", () => {
  it("devrait accepter les identifiants de connexion valides", () => {
    const validLogin = {
      email: "user@example.com",
      password: "SecurePassword123!",
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter la connexion sans e-mail", () => {
    const result = loginSchema.safeParse({
      password: "SecurePassword123!",
    });
    expect(result.success).toBe(false);
  });

  it("devrait rejeter la connexion sans mot de passe", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("devrait rejeter la connexion avec un e-mail invalide", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "SecurePassword123!",
    });
    expect(result.success).toBe(false);
  });

  it("devrait accepter diff\u00e9rents mots de passe valides", () => {
    // Les mots de passe doivent avoir: 8+ caract\u00e8res, minuscules, majuscules, chiffre, caract\u00e8re sp\u00e9cial, max 20 caract\u00e8res
    const validPasswords = [
      "SimplePassword123!", // 18 chars - all requirements
      "Password123!", // 12 chars - all requirements
      "ALLCAPS123#lower", // 16 chars - all requirements
      "SecurePass1@", // 12 chars - all requirements
      "Secure2Pass!", // 12 chars - all requirements
    ];

    validPasswords.forEach((password) => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe("Sch\u00e9ma d'Inscription", () => {
  it("devrait accepter les donn\u00e9es d'inscription valides", () => {
    const validRegister = {
      firstname: "Jean",
      lastname: "Dupont",
      pseudo: "jeandupont",
      email: "jean@example.com",
      password: "SecurePassword123!",
      confirm: "SecurePassword123!",
    };

    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter l'inscription sans pr\u00e9nom", () => {
    const result = registerSchema.safeParse({
      lastname: "Dupont",
      pseudo: "jeandupont",
      email: "jean@example.com",
      password: "SecurePassword123!",
      confirm: "SecurePassword123!",
    });
    expect(result.success).toBe(false);
  });

  it("devrait rejeter l'inscription avec des mots de passe non appari\u00e9s", () => {
    const result = registerSchema.safeParse({
      firstname: "Jean",
      lastname: "Dupont",
      pseudo: "jeandupont",
      email: "jean@example.com",
      password: "SecurePassword123!",
      confirm: "DifferentPassword456!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.path.includes("confirm") ||
            issue.message.includes("ne correspondent pas") ||
            issue.message.includes("do not match"),
        ),
      ).toBe(true);
    }
  });

  it("devrait rejeter l'inscription avec un e-mail invalide", () => {
    const result = registerSchema.safeParse({
      firstname: "Jean",
      lastname: "Dupont",
      pseudo: "jeandupont",
      email: "invalid-email",
      password: "SecurePassword123!",
      confirm: "SecurePassword123!",
    });
    expect(result.success).toBe(false);
  });

  it("devrait accepter le pseudo optionnel", () => {
    const result = registerSchema.safeParse({
      firstname: "Jean",
      lastname: "Dupont",
      pseudo: "",
      email: "jean@example.com",
      password: "SecurePassword123!",
      confirm: "SecurePassword123!",
    });
    expect(result.success).toBe(true);
  });

  it("devrait valider correctement tous les sch\u00e9mas imbriqu\u00e9s", () => {
    const testCases = [
      {
        data: {
          firstname: "Jo", // Trop court
          lastname: "Dupont",
          pseudo: "jeandupont",
          email: "jean@example.com",
          password: "SecurePassword123!",
          confirm: "SecurePassword123!",
        },
        shouldPass: false,
      },
      {
        data: {
          firstname: "Jean",
          lastname: "D", // Trop court
          pseudo: "jeandupont",
          email: "jean@example.com",
          password: "SecurePassword123!",
          confirm: "SecurePassword123!",
        },
        shouldPass: false,
      },
      {
        data: {
          firstname: "Jean",
          lastname: "Dupont",
          pseudo: "jean@invalid", // Caract\u00e8res invalides
          email: "jean@example.com",
          password: "SecurePassword123!",
          confirm: "SecurePassword123!",
        },
        shouldPass: false,
      },
      {
        data: {
          firstname: "Jean",
          lastname: "Dupont",
          pseudo: "jeandupont",
          email: "user@yopmail.com", // E-mail jetable
          password: "SecurePassword123!",
          confirm: "SecurePassword123!",
        },
        shouldPass: false,
      },
    ];

    testCases.forEach((testCase) => {
      const result = registerSchema.safeParse(testCase.data);
      expect(result.success).toBe(testCase.shouldPass);
    });
  });
});

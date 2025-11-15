import { z } from "zod";

// ========================================================
// EMAIL (trim, lowercase, TLD min 2, anti-jetable)
// ========================================================
const disposableDomains = [
  "yopmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "trashmail.com",
];

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email invalide.")
  .refine(
    (val) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(val),
    "Adresse email invalide."
  )
  .refine(
    (val) => !disposableDomains.includes(val.split("@")[1]),
    "Les emails jetables ne sont pas autorisés."
  );

// ========================================================
// FIRSTNAME : min 3, accents autorisés, tirets/espace ok
// ========================================================
const firstnameSchema = z
  .string()
  .trim()
  .min(3, "Le prénom doit contenir au moins 3 caractères.")
  .max(50, "Prénom trop long.")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    "Format du prénom invalide."
  );

// ========================================================
// LASTNAME : min 2, apostrophe autorisée, accents ok
// ========================================================
const lastnameSchema = z
  .string()
  .trim()
  .min(2, "Le nom doit contenir au moins 2 caractères.")
  .max(50, "Nom trop long.")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    "Format du nom invalide."
  );

// ========================================================
// PSEUDO : alphanum, _, -, [ ], banlist mode contains
// ========================================================
const bannedWords = [
  "dev", "test", "admin", "root", "system", "support", "moderator", "owner",
];

const pseudoSchema = z
  .string()
  .trim()
  .min(2, "Le pseudo doit contenir au moins 2 caractères.")
  .max(20, "Le pseudo ne doit pas dépasser 20 caractères.")
  .regex(
    /^[A-Za-z0-9_\-\[\]]+$/,
    "Le pseudo ne peut contenir que lettres, chiffres, -, _, [ ]"
  )
  .refine(
    (val) => !/[À-ÖØ-öø-ÿ]/.test(val),
    "Les accents ne sont pas autorisés dans le pseudo."
  )
  .refine(
    (val) => !/\s/.test(val),
    "Le pseudo ne doit pas contenir d'espaces."
  )
  .refine(
    (val) =>
      !bannedWords.some((bad) =>
        val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(bad)
      ),
    "Ce pseudo contient un mot interdit."
  )
  .optional();

// ========================================================
// PASSWORD : 8–20, maj, min, chiffre, spécial, no accents
// ========================================================
const passwordSchema = z
  .string()
  .trim()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(20, "Le mot de passe ne doit pas dépasser 20 caractères.")
  .refine(
    (val) => /[a-z]/.test(val),
    "Doit contenir au moins une minuscule."
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    "Doit contenir au moins une majuscule."
  )
  .refine(
    (val) => /[0-9]/.test(val),
    "Doit contenir au moins un chiffre."
  )
  .refine(
    (val) => /[!@#$%^&*()_\-+.?]/.test(val),
    "Doit contenir au moins un caractère spécial."
  )
  .refine(
    (val) => !/[À-ÖØ-öø-ÿ]/.test(val),
    "Les accents ne sont pas autorisés."
  )
  .refine(
    (val) => !/[^\u0000-\u00ff]/.test(val),
    "Les emojis ne sont pas autorisés."
  )
  .refine(
    (val) => !/\s/.test(val),
    "Les espaces ne sont pas autorisés."
  );

// ========================================================
// SCHEMA FINAL : REGISTER
// ========================================================
export const registerSchema = z
  .object({
    firstname: firstnameSchema,
    lastname: lastnameSchema,
    pseudo: pseudoSchema,
    email: emailSchema,
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });

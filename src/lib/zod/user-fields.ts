import { z } from "zod";

// ---------------------------------------------------------
//  EMAIL SCHEMA (anti-jetable, format strict, lowercase)
// ---------------------------------------------------------
const disposableDomains = [
  "yopmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "trashmail.com",
];

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email invalide.")
  .refine(
    (val) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(val),
    "Adresse email invalide.",
  )
  .refine(
    (val) => !disposableDomains.includes(val.split("@")[1]),
    "Les emails jetables ne sont pas autorisés.",
  );

// ---------------------------------------------------------
// FIRSTNAME (accents ok, longueur, formats nom)
// ---------------------------------------------------------
export const firstnameSchema = z
  .string()
  .trim()
  .min(3, "Le prénom doit contenir au moins 3 caractères.")
  .max(50, "Prénom trop long.")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    "Format du prénom invalide.",
  );

// ---------------------------------------------------------
// LASTNAME
// ---------------------------------------------------------
export const lastnameSchema = z
  .string()
  .trim()
  .min(2, "Le nom doit contenir au moins 2 caractères.")
  .max(50, "Nom trop long.")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    "Format du nom invalide.",
  );

// ---------------------------------------------------------
// PSEUDO (alphanum, _, -, [], no accents, banlist)
// ---------------------------------------------------------
const bannedWords = [
  "dev",
  "test",
  "admin",
  "root",
  "system",
  "support",
  "moderator",
  "owner",
];

const pseudoNonEmptySchema = z
  .string()
  .trim()
  .min(2, "Le pseudo doit contenir au moins 2 caractères.")
  .max(20, "Le pseudo ne doit pas dépasser 20 caractères.")
  .regex(
    /^[A-Za-z0-9_\-[\]]+$/,
    "Caractères autorisés : lettres, chiffres, -, _, [ ]",
  )
  .refine(
    (val) => !/[À-ÖØ-öø-ÿ]/.test(val),
    "Les accents ne sont pas autorisés.",
  )
  .refine((val) => !/\s/.test(val), "Pas d'espaces.")
  .refine(
    (val) =>
      !bannedWords.some((bad) =>
        val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(bad),
      ),
    "Ce pseudo contient un mot interdit.",
  );

export const pseudoSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => val ?? "")
  .refine(
    (val) => val === "" || pseudoNonEmptySchema.safeParse(val).success,
    "Le pseudo n'est pas valide.",
  );

// ---------------------------------------------------------
// PASSWORD (règles strictes)
// ---------------------------------------------------------
export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(20, "Le mot de passe ne doit pas dépasser 20 caractères.")
  .refine((v) => /[a-z]/.test(v), "Doit contenir une minuscule.")
  .refine((v) => /[A-Z]/.test(v), "Doit contenir une majuscule.")
  .refine((v) => /[0-9]/.test(v), "Doit contenir un chiffre.")
  .refine(
    (v) => /[!@#$%^&*()_\-+.?]/.test(v),
    "Doit contenir un caractère spécial.",
  )
  .refine((v) => !/[À-ÖØ-öø-ÿ]/.test(v), "Pas d'accents.")
  .refine((v) => /^[\x20-\x7E]+$/.test(v), "Pas d'emojis.")
  .refine((v) => !/\s/.test(v), "Pas d'espaces.");

// ---------------------------------------------------------
// AVATAR URL (OPTION C) http/https + data:image allowed
// ---------------------------------------------------------
export const avatarUrlSchema = z
  .string()
  .trim()
  .url("URL avatar invalide.")
  .refine((val) => {
    try {
      const url = new URL(val);

      // 1) protocol allowed
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;

      // 2) block localhost / SSRF attempts
      if (["localhost", "127.0.0.1", "::1"].includes(url.hostname))
        return false;

      // 3) basic XSS attempt prevention
      const lower = val.toLowerCase();
      if (lower.includes("<script") || lower.includes("%3cscript"))
        return false;

      return true;
    } catch {
      return false;
    }
  }, "URL d'avatar non autorisée (sécurité).")
  .or(
    z
      .string()
      .regex(
        /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/,
        "Format data:image invalide.",
      ),
  )
  .nullable()
  .optional();

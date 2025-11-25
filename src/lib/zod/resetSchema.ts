import { z } from "zod";

// ----------------------
// Email FULL (même que register)
// ----------------------
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
    "Adresse email invalide.",
  )
  .refine(
    (val) => !disposableDomains.includes(val.split("@")[1]),
    "Les emails jetables ne sont pas autorisés.",
  );

// ----------------------
// Password FULL RULES
// ----------------------
const passwordSchema = z
  .string()
  .trim()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(20, "Le mot de passe ne doit pas dépasser 20 caractères.")
  .refine((val) => /[a-z]/.test(val), "Doit contenir une minuscule.")
  .refine((val) => /[A-Z]/.test(val), "Doit contenir une majuscule.")
  .refine((val) => /[0-9]/.test(val), "Doit contenir un chiffre.")
  .refine(
    (val) => /[!@#$%^&*()_\-+.?]/.test(val),
    "Doit contenir un caractère spécial.",
  )
  .refine((val) => !/[À-ÖØ-öø-ÿ]/.test(val), "Pas d'accents autorisés.")
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Valid regex for allowed characters
  .refine((val) => !/[^\u0000-\u00ff]/.test(val), "Pas d'emojis.")
  .refine((val) => !/\s/.test(val), "Pas d'espaces.");

export const resetRequestSchema = z.object({
  email: emailSchema,
});

export const resetConfirmSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Les mots de passe ne correspondent pas.",
  });

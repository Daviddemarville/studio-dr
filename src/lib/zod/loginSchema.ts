import { z } from "zod";

// --------------------------
// Email complet (trim, lowercase, TLD, anti-jetable)
// --------------------------
const disposableDomains = [
  "yopmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "trashmail.com",
];

const loginEmailSchema = z
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

export const loginSchema = z.object({
  email: loginEmailSchema,
  password: z.string().min(1, "Mot de passe requis."),
});

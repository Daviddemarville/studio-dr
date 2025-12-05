import { z } from "zod";

export const userProfileSchema = z.object({
  firstname: z.string().min(1, "Prénom obligatoire"),
  lastname: z.string().min(1, "Nom obligatoire"),
  pseudo: z.string().nullable().optional(),
  email: z.string().email("Email invalide"),
  bio_fr: z.string().nullable().optional(),
  bio_en: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),

  url_portfolio: z.string().url().nullable().optional(),
  url_linkedin: z.string().url().nullable().optional(),
  url_github: z.string().url().nullable().optional(),
});

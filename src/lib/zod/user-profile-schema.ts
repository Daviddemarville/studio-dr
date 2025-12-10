import { z } from "zod";
import {
  avatarUrlSchema,
  emailSchema,
  firstnameSchema,
  lastnameSchema,
  pseudoSchema,
} from "./user-fields";

export const userProfileSchema = z.object({
  firstname: firstnameSchema.optional(),
  lastname: lastnameSchema.optional(),
  pseudo: pseudoSchema.optional(),
  email: emailSchema.optional(),
  avatar_url: avatarUrlSchema.optional().nullable(),
  bio_fr: z.string().nullable().optional(),
  bio_en: z.string().nullable().optional(),
  url_portfolio: z.string().url().nullable().optional(),
  url_linkedin: z.string().url().nullable().optional(),
  url_github: z.string().url().nullable().optional(),
});

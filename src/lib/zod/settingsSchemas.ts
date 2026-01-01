import { z } from "zod";

/**
 * ==========================================
 *  GENERAL SETTINGS
 * ==========================================
 */
export const settingsGeneralSchema = z.object({
  site_name: z.string().min(1, "Le nom du site est obligatoire"),

  tagline: z.string().optional(),
  site_description: z.string().optional(),

  logo_url: z.string().url("URL du logo invalide").optional().or(z.literal("")),
  favicon_url: z
    .string()
    .url("URL du favicon invalide")
    .optional()
    .or(z.literal("")),

  language_default: z.enum(["fr", "en"]),

  available_languages: z
    .array(z.enum(["fr", "en"]))
    .min(1, "Au moins une langue doit être sélectionnée"),

  ga_tracking_id: z.string().optional(),
});

export type SettingsGeneralInput = z.infer<typeof settingsGeneralSchema>;

/**
 * ==========================================
 *  SEO GLOBAL
 * ==========================================
 */
export const settingsSeoGlobalSchema = z.object({
  meta_default_title: z.string().optional(),
  meta_default_description: z.string().optional(),

  default_meta_image_url: z
    .string()
    .url("URL d’image invalide")
    .optional()
    .or(z.literal("")),

  canonical_url: z
    .string()
    .url("URL canonique invalide")
    .optional()
    .or(z.literal("")),
});

export type SettingsSeoGlobalInput = z.infer<typeof settingsSeoGlobalSchema>;

/**
 * ==========================================
 *  SEO PAR PAGE (site_sections)
 * ==========================================
 */
export const pageSeoSchema = z.object({
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),

  seo_image_url: z
    .string()
    .url("URL d’image invalide")
    .optional()
    .or(z.literal("")),

  seo_keywords: z.array(z.string()).optional(),

  noindex: z.boolean().optional(),
});

export type PageSeoInput = z.infer<typeof pageSeoSchema>;

/**
 * ==========================================
 *  MENTIONS LÉGALES
 * ==========================================
 */
export const mentionsLegalesSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .min(1, "Au moins une section doit être présente"),
});

export type MentionsLegalesInput = z.infer<typeof mentionsLegalesSchema>;

/**
 * ==========================================
 *  POLITIQUE DE CONFIDENTIALITÉ
 * ==========================================
 */
export const politiqueConfidentialiteSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .min(1, "Au moins une section doit être présente"),
});

export type PolitiqueConfidentialiteInput = z.infer<
  typeof politiqueConfidentialiteSchema
>;

/**
 * ==========================================
 *  CONDITIONS GÉNÉRALES DE VENTE
 * ==========================================
 */
export const conditionsVenteSchema = z.object({
  sections: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .min(1, "Au moins une section doit être présente"),
});

export type ConditionsVenteInput = z.infer<typeof conditionsVenteSchema>;

/**
 * ==========================================
 *  MODE MAINTENANCE
 * ==========================================
 */
export const maintenanceSchema = z.object({
  maintenance_mode: z.boolean().default(false),

  maintenance_message_fr: z.string().optional(),
  maintenance_message_en: z.string().optional(),
  maintenance_allowlist: z.array(z.string()).optional(),
});

export type MaintenanceInput = z.infer<typeof maintenanceSchema>;

/**
 * ==========================================
 *  INFORMATIONS ENTREPRISE
 * ==========================================
 */
export const companyInfoSchema = z.object({
  contact_email: z.string().email("Email invalide").optional(),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),

  google_maps_url: z
    .string()
    .url("URL Google Maps invalide")
    .optional()
    .or(z.literal("")),

  social_facebook_url: z
    .string()
    .url("URL Facebook invalide")
    .optional()
    .or(z.literal("")),
  social_instagram_url: z
    .string()
    .url("URL Instagram invalide")
    .optional()
    .or(z.literal("")),
  social_linkedin_url: z
    .string()
    .url("URL LinkedIn invalide")
    .optional()
    .or(z.literal("")),
  social_github_url: z
    .string()
    .url("URL GitHub invalide")
    .optional()
    .or(z.literal("")),
});

export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;

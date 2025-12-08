/* --------------------------------------------------------------------------
 * TYPES COMMUNS POUR LE SYSTÈME DE SECTIONS
 * -------------------------------------------------------------------------- */

import type {
  TemplateFieldType,
  TemplateWithSlug,
} from "@/templates/sections/loader.server";

// Re-export for convenience
export type { TemplateFieldType };

export interface TemplateFieldRepeater extends TemplateFieldType {
  type: "repeater";
  fields: TemplateFieldType[];
}

/* --------------------------------------------------------------------------
 * STRUCTURE DES SECTIONS
 * -------------------------------------------------------------------------- */

export interface SiteSection {
  id: number;
  slug: string;
  title: string;
  table_name: string;
  template_slug: string | null;
  is_active: boolean;
  icon: string;
}

/* --------------------------------------------------------------------------
 * STRUCTURE DES LIGNES DE CONTENU
 * -------------------------------------------------------------------------- */

export interface DBRow {
  id: string;
  section_slug: string;
  content: Record<string, unknown>;
  display_order?: number;
  price_ht?: number;
  price_ttc?: number;
  tva_rate?: number;
  offer_id?: string;
  [key: string]: unknown;
}

/* --------------------------------------------------------------------------
 * RÉSULTAT DU LOADER
 * -------------------------------------------------------------------------- */

export interface LoadedSectionData {
  section: SiteSection;
  template: TemplateWithSlug | null;
  rows: DBRow[];
  formData: Record<string, unknown> | null;
}

/* --------------------------------------------------------------------------
 * REPEATER ITEM TYPE
 * -------------------------------------------------------------------------- */

export interface RepeaterItem {
  _id?: string;
  id?: string;
  display_order?: number;
  price_ht?: number;
  price_ttc?: number;
  tva_rate?: number;
  offer_id?: string;
  [key: string]: unknown;
}

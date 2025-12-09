/* --------------------------------------------------------------------------
 * TYPES COMMUNS POUR LE SYSTÈME DE SECTIONS
 * -------------------------------------------------------------------------- */

import type { TemplateType } from "@/types/public";

export interface TemplateFieldBase {
  type: string;
  name: string;
  label?: string;
}

export interface TemplateFieldSingle extends TemplateFieldBase {
  type: "text" | "textarea" | "number" | "image";
}

export interface TemplateFieldRepeater extends TemplateFieldBase {
  type: "repeater";
  fields: TemplateFieldSingle[];
  min?: number;
  max?: number;
}

export type TemplateField = TemplateFieldSingle | TemplateFieldRepeater;

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
  template: TemplateType; // TemplateWithSlug
  rows: DBRow[];
  formData: Record<string, unknown> | null;
}

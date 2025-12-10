// src/types/newsection.ts

import type { TemplateFieldType } from "@/lib/zod/sectionTemplateSchema";

/* --------------------------------------------------------------------------
 * Confirm / Modal actions (fichier déjà existant dans ton projet)
 * -------------------------------------------------------------------------- */
export interface ConfirmOptions {
  title: string;
  message: string;
}
export type ConfirmResult = boolean;

/* --------------------------------------------------------------------------
 * Section de la table `site_sections` (pour le module New Section)
 * -------------------------------------------------------------------------- */
export interface Section {
  id: number;
  title: string;
  slug: string;
  template_slug: string | null;
  table_name: string;
  is_active: boolean;
  position: number;
  icon: string | null;
}

/* --------------------------------------------------------------------------
 * Template minimal (pour les listes)
 * -------------------------------------------------------------------------- */
export interface Template {
  slug: string;
  name: string;
  description?: string;
}

/* --------------------------------------------------------------------------
 * Template COMPLET chargé via loader.server (Zod + slug)
 * -------------------------------------------------------------------------- */
export interface NewSectionTemplate {
  slug: string;
  name: string;
  description?: string;
  type: string;
  fields: TemplateFieldType[]; // Zod types safe
}

/* --------------------------------------------------------------------------
 * PreviewModal Props — strict et sûr
 * -------------------------------------------------------------------------- */
export interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  templateSlug: string | null;
}

/* --------------------------------------------------------------------------
 * Données envoyées à TemplatePreview
 * -------------------------------------------------------------------------- */
export interface PreviewTemplate {
  name: string;
  description?: string;
  fields: TemplateFieldType[];
}

export type PreviewField =
  | {
      type: "text" | "textarea" | "number" | "image" | "relation";
      name: string;
      label?: string;
    }
  | {
      type: "repeater";
      name: string;
      label?: string;
      min?: number;
      max?: number;
      fields: PreviewField[];
    };

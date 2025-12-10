/* ============================================================
   PUBLIC TYPES — utilisés uniquement côté front public
   ============================================================ */

/* -------------------------
   Offre commerciale (pricing)
-------------------------- */
export interface Offer {
  id: string;
  price_ht?: number;
  is_active?: boolean;
  display_order?: number;

  title_fr?: string;
  title_en?: string;

  short_fr?: string;
  short_en?: string;

  long_fr?: string;
  long_en?: string;
}

/* -------------------------
   Provider OAuth (public)
-------------------------- */
export interface ProviderType {
  provider: "github" | "google" | "discord";
  className?: string;
}

/* -------------------------
   Messages du formulaire de contact
-------------------------- */
export interface MessageType {
  id?: string;
  created_at?: string;
  is_read?: boolean;

  firstname?: string;
  lastname?: string;
  email?: string;
  subject?: string;
  message?: string;

  current?: boolean;
  title?: string;
}

/* ============================================================
   TEMPLATES PUBLICS (version simplifiée)
   ============================================================ */

export interface PublicField {
  name: string;
  type: string;
  label?: string;
  min?: number;
  max?: number;
  fields?: PublicField[]; // repeater interne
}

export interface PublicTemplate {
  name: string;
  description?: string;
  type?: string;
  fields: PublicField[];
}

/* ============================================================
   SECTION (métadonnées)
   ============================================================ */
export interface PublicSection {
  id: number;
  slug: string;
  title: string;
  icon: string | null;
  table_name: string;
  template_slug: string | null;
}

/* ============================================================
   🔵 PUBLIC USER ROW
   (pour section Qui Sommes-Nous)
   ============================================================ */
export interface PublicUserRow {
  id?: string | number;

  avatar_url?: string;
  pseudo?: string;

  firstname?: string;
  lastname?: string;

  bio_fr?: string;
  bio_en?: string;

  is_public?: boolean;
  is_approved?: boolean;

  // fallback dynamique
  [key: string]: unknown;
}

/* ============================================================
   🔵 PUBLIC WORKFLOW STEP
   (pour section Comment travaillons-nous ?)
   ============================================================ */
export interface PublicWorkflowStep {
  id?: string | number;

  step_number?: number;
  content?: Record<string, unknown>;

  step_title_fr?: string;
  step_title_en?: string;

  body_fr?: string;
  body_en?: string;

  [key: string]: unknown;
}

/* ============================================================
   🔵 GENERIC PUBLIC ROW (fallback dynamique)
   ============================================================ */
export interface PublicDBRow {
  id: number | string;
  section_slug?: string;

  content: Record<string, unknown>; // structure flexible

  // Support des champs potentiels
  title_fr?: string;
  title_en?: string;

  subtitle_fr?: string;
  subtitle_en?: string;

  body_fr?: string;
  body_en?: string;

  price_ht?: number;

  // fallback dynamique final
  [key: string]: unknown;
}

/* ============================================================
   Item dans un repeater
   ============================================================ */
export interface PublicRepeaterItem {
  id?: string | number;
  _id?: string;

  [key: string]: unknown;
}

/* --------------------------------------------------------------------------
 * TYPES COMMUNS POUR LE SYSTÈME DE SECTIONS (ADMIN)
 * Source centralisée pour :
 * - loadSection
 * - saveSection
 * - SectionEditorWrapper
 * - renderDynamicField
 * - RepeaterEditor
 * -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
 * TEMPLATE FIELDS (pour les fichiers templates/*.json)
 * -------------------------------------------------------------------------- */

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
 * TEMPLATE ADMIN (chargé par getTemplate)
 * -------------------------------------------------------------------------- */

export interface AdminTemplateType {
  name?: string;
  description?: string;
  fields?: TemplateField[]; // Peuvent contenir repeaters
}

/* --------------------------------------------------------------------------
 * SECTION (table site_sections)
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
 * DB ROW (données stockées dans les tables dynamiques)
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
 * RESULTAT DU LOADER (loadSection)
 * -------------------------------------------------------------------------- */

export interface LoadedSectionData {
  section: SiteSection;
  template: AdminTemplateType | null;
  rows: DBRow[];
  formData: Record<string, unknown> | null;
}

/* --------------------------------------------------------------------------
 * CHAMPS UTILISÉS DANS L'EDITEUR ADMIN (renderDynamicField, RepeaterEditor)
 * -------------------------------------------------------------------------- */

export interface SectionFieldBase {
  name: string;
  label?: string;
  type: "text" | "textarea" | "number" | "image" | "repeater" | "relation";
}

export interface SectionFieldSingle extends SectionFieldBase {
  type: "text" | "textarea" | "number" | "image";
}

export interface SectionFieldRepeater extends SectionFieldBase {
  type: "repeater";
  fields: SectionFieldSingle[];
  table_name?: string;
  section_slug?: string;
}

export interface SectionFieldRelation extends SectionFieldBase {
  type: "relation";
  relation_table: string;
}

export type SectionField =
  | SectionFieldSingle
  | SectionFieldRepeater
  | SectionFieldRelation;

/* --------------------------------------------------------------------------
 * formData typing
 * -------------------------------------------------------------------------- */

export interface RepeaterItemType {
  _id: string; // interne React
  id?: string; // DB UUID
  [key: string]: unknown;
}

export type PrimitiveFieldValueType = string | number | boolean | null;

export type FieldValueType = PrimitiveFieldValueType | RepeaterItemType[];

export type FormDataType = Record<string, FieldValueType>;

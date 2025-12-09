export interface Offer {
  id: string;
  price_ht?: number | string;
  is_active?: boolean;
  display_order?: number;

  title_fr?: string;
  title_en?: string;
  short_fr?: string;
  short_en?: string;
  long_fr?: string;
  long_en?: string;
}

export interface providerType {
  provider: "github" | "google" | "discord";
  className?: string;
}

export interface MessageType {
  created_at?: string;
  id?: string;
  is_read?: boolean;
  firstname?: string;
  lastname?: string;
  email?: string;
  subject?: string;
  message?: string;
  current?: boolean;
  title?: string;
}

export interface TemplateType {
  open?: boolean;
  onClose?: () => void;
  templateSlug?: string;
  type?: string;
  min?: number;
  field?: string;
  fields?: FieldType[];
  template?: {
    name?: string;
    description?: string;
    type?: string;
    fields?: [];
  } | null;
}

export interface FieldType {
  _id?: string;
  name: string;
  type?: string;
  field?: string;
  min?: number;
  label?: string;
  fields?: FieldType[];
}

export interface SectionType {
  id: number;
  slug: string;
  table_name: string;
  title: string;
  is_active: boolean;
  icon: string;
}

export interface DBRow {
  id: number;
  section_slug: string;
  content: Record<string, unknown>;
}

// un item dans un repeater
export interface RepeaterItemType {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

export type SaveSectionParamsType = {
  section: SectionType;
  template: TemplateType; // ou: { fields: TemplateField[] } si tu veux limiter
  formData: FormDataType;
  rows: DBRow[];
  title: string;
  icon: string;
  isVisible: boolean;
};

// valeur simple d’un champ
export type PrimitiveFieldValueType = string | number | boolean | null;

// valeur possible pour un champ
export type FieldValueType = PrimitiveFieldValueType | RepeaterItemType[];

// tout le formData : un objet clé/valeur
export type FormDataType = Record<string, FieldValueType>;

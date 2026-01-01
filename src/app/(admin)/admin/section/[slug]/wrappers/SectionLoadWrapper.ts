import { createClient } from "@/lib/supabase-browser";
import type {
  TemplateFieldType,
  TemplateSchemaType,
} from "@/lib/zod/sectionTemplateSchema";
import { getTemplate } from "@/templates/sections/loader.server";
import type {
  AdminTemplateType,
  DBRow,
  LoadedSectionData,
  RepeaterItemType,
  TemplateField,
  TemplateFieldRelation,
  TemplateFieldRepeater,
  TemplateFieldSingle,
} from "@/types/section";

/* --------------------------------------------------------------
 * Liste stricte des types autorisés pour TemplateFieldSingle
 * -------------------------------------------------------------- */
const allowedSingleTypes = ["text", "textarea", "number", "image"] as const;
type AllowedSingleFieldType = (typeof allowedSingleTypes)[number];

function asSingleFieldType(type: string): AllowedSingleFieldType {
  if (allowedSingleTypes.includes(type as AllowedSingleFieldType)) {
    return type as AllowedSingleFieldType;
  }
  throw new Error(`Invalid field type "${type}" for TemplateFieldSingle`);
}

/* --------------------------------------------------------------
 * Normalisation d’un champ de template (SINGLE / RELATION / REPEATER)
 * -------------------------------------------------------------- */
function normalizeField(f: TemplateFieldType): TemplateField {
  // -----------------------------
  // SINGLE FIELDS (logique existante, inchangée)
  // -----------------------------
  if (
    f.type === "text" ||
    f.type === "textarea" ||
    f.type === "number" ||
    f.type === "image"
  ) {
    return {
      type: asSingleFieldType(f.type),
      name: f.name,
      label: f.label,
    } satisfies TemplateFieldSingle;
  }

  // -----------------------------
  // RELATION FIELD (nouveau chemin explicite)
  // -----------------------------
  if (f.type === "relation") {
    return {
      type: "relation",
      name: f.name,
      label: f.label,
      relation_table: f.relation_table,
    } satisfies TemplateFieldRelation;
  }

  // -----------------------------
  // REPEATER FIELD (récursif, sécurisé)
  // -----------------------------
  if (f.type === "repeater") {
    const subfieldsArray = Array.isArray(f.fields) ? f.fields : [];

    return {
      type: "repeater",
      name: f.name,
      label: f.label,
      min: f.min,
      max: f.max,
      fields: subfieldsArray.map(normalizeField),
    } satisfies TemplateFieldRepeater;
  }

  throw new Error(`Unsupported template field type "${f.type}"`);
}

/* --------------------------------------------------------------
 * Conversion TemplateSchemaType → AdminTemplateType
 * -------------------------------------------------------------- */
function normalizeTemplate(
  raw: TemplateSchemaType | null,
): AdminTemplateType | null {
  if (!raw) return null;

  return {
    name: raw.name,
    description: raw.description,
    fields: raw.fields.map(normalizeField),
  };
}

/* --------------------------------------------------------------
 * LOAD WRAPPER ADMIN
 * -------------------------------------------------------------- */
export async function loadSection(slug: string): Promise<LoadedSectionData> {
  const supabase = createClient();

  /* --- 1) SECTION --- */
  const { data: section } = await supabase
    .from("site_sections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!section) {
    throw new Error("Section introuvable");
  }

  /* --- 2) TEMPLATE --- */
  const rawTemplate = section.template_slug
    ? await getTemplate(section.template_slug)
    : null;

  const template = normalizeTemplate(rawTemplate);

  /* --- 3) ROWS --- */
  let query = supabase
    .from(section.table_name)
    .select("*")
    .eq("section_slug", slug);

  if (section.table_name === "users") {
    query = query.eq("is_approved", true);
  } else if (
    ["content_offers", "content_pricing", "content_custom_sections"].includes(
      section.table_name,
    )
  ) {
    query = query.order("display_order", { ascending: true });
  } else if (section.table_name === "content_workflow_steps") {
    query = query.order("step_number", { ascending: true });
  }

  const { data: rowsData } = await query;
  const rows = (rowsData ?? []) as DBRow[];

  /* --- 4) FORMDATA --- */
  let formData: Record<string, unknown> | null = null;

  const repeaterField = template?.fields?.find(
    (f): f is TemplateFieldRepeater => f.type === "repeater",
  );

  if (repeaterField) {
    const items: RepeaterItemType[] = rows.map((row) => ({
      _id: crypto.randomUUID(),
      ...row.content,
      id: row.id,
      display_order: row.display_order,
      ...(row.price_ht !== undefined ? { price_ht: row.price_ht } : {}),
      ...(row.price_ttc !== undefined ? { price_ttc: row.price_ttc } : {}),
      ...(row.tva_rate !== undefined ? { tva_rate: row.tva_rate } : {}),
      ...(row.offer_id !== undefined ? { offer_id: row.offer_id } : {}),
    }));

    formData = { [repeaterField.name]: items };
  } else {
    const row = rows[0] ?? { content: {} };

    formData =
      section.table_name === "users"
        ? row
        : (row.content as Record<string, unknown>);
  }

  return {
    section,
    template,
    rows,
    formData,
  };
}

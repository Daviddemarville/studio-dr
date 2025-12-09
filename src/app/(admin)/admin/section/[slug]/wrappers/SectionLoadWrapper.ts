import { createClient } from "@/lib/supabase-browser";
import { getTemplate } from "@/templates/sections/loader.server";
import type { DBRow, LoadedSectionData, TemplateFieldRepeater } from "./types";

/* --------------------------------------------------------------------------
 * LOAD WRAPPER : lecture section + template + données + formData
 * -------------------------------------------------------------------------- */

export async function loadSection(slug: string): Promise<LoadedSectionData> {
  const supabase = createClient();

  /* --- 1) SECTION -------------------------------------------------------- */
  const { data: section } = await supabase
    .from("site_sections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!section) throw new Error("Section introuvable");

  /* --- 2) TEMPLATE ------------------------------------------------------- */
  const template = section.template_slug
    ? await getTemplate(section.template_slug)
    : null;

  /* --- 3) ROWS ----------------------------------------------------------- */
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
  const rows: DBRow[] = rowsData ?? [];

  /* --- 4) FORMDATA ------------------------------------------------------- */
  let formData: Record<string, unknown> | null = null;

  if (template) {
    const repeaterField = template.fields.find((f) => f.type === "repeater") as
      | TemplateFieldRepeater
      | undefined;

    if (repeaterField) {
      formData = {
        [repeaterField.name]: rows.map((row) => ({
          ...row.content,
          id: row.id,
          display_order: row.display_order,
          ...(row.price_ht !== null &&
            row.price_ht !== undefined && { price_ht: row.price_ht }),
          ...(row.price_ttc !== null &&
            row.price_ttc !== undefined && { price_ttc: row.price_ttc }),
          ...(row.tva_rate !== null &&
            row.tva_rate !== undefined && { tva_rate: row.tva_rate }),
          ...(row.offer_id !== null &&
            row.offer_id !== undefined && { offer_id: row.offer_id }),
        })),
      };
    } else {
      const row = rows[0] ?? { content: {} };
      formData = section.table_name === "users" ? row : row.content;
    }
  }

  return {
    section,
    template,
    rows,
    formData,
  };
}

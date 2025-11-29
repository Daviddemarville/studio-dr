import { createClient } from "@/lib/supabase-browser";
import {
    DBRow,
    SiteSection,
    TemplateField,
    TemplateFieldRepeater,
} from "./types";

/* --------------------------------------------------------------------------
 * SAVE WRAPPER : enregistre repeater / single row / metadata
 * -------------------------------------------------------------------------- */

export async function saveSection({
    section,
    template,
    formData,
    rows,
    title,
    icon,
    isVisible,
}: {
    section: SiteSection;
    template: { fields: TemplateField[] };
    formData: Record<string, unknown>;
    rows: DBRow[];
    title: string;
    icon: string;
    isVisible: boolean;
}) {
    const supabase = createClient();
    const table = section.table_name;

    const repeaterField = template.fields.find(
        (f: TemplateField) => f.type === "repeater"
    ) as TemplateFieldRepeater | undefined;

    /* ----------------------------------------------------------------------
     * CASE 1 — REPEATER
     * ---------------------------------------------------------------------- */
    if (repeaterField) {
        const items = formData[repeaterField.name] as Record<string, unknown>[];
        const currentIds: string[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const contentFields: Record<string, unknown> = {};
            repeaterField.fields.forEach((f) => {
                contentFields[f.name] = item[f.name];
            });

            const payload: {
                section_slug: string;
                content: Record<string, unknown>;
                display_order: number;
                step_number?: number;
            } = {
                section_slug: section.slug,
                content: contentFields,
                display_order: i + 1,
            };

            if (table === "content_workflow_steps") {
                payload.step_number = i + 1;
            }

            if (item.id) {
                await supabase.from(table).update(payload).eq("id", item.id);
                currentIds.push(item.id as string);
            } else {
                const { data: inserted } = await supabase
                    .from(table)
                    .insert(payload)
                    .select("id")
                    .single();

                if (inserted) currentIds.push(inserted.id);
            }
        }

        // Delete removed items safely
        const initialIds = rows.map((r: DBRow) => r.id);
        const toDelete = initialIds.filter(
            (id: string) => !currentIds.includes(id)
        );

        if (toDelete.length > 0) {
            await supabase
                .from(table)
                .delete()
                .in("id", toDelete)
                .eq("section_slug", section.slug);
        }
    }

    /* ----------------------------------------------------------------------
     * CASE 2 — SINGLE ROW — CUSTOM SECTIONS
     * ---------------------------------------------------------------------- */
    else if (table === "content_custom_sections") {
        const { data: existing } = await supabase
            .from(table)
            .select("id")
            .eq("section_slug", section.slug)
            .maybeSingle();

        if (!existing) {
            await supabase.from(table).insert({
                section_slug: section.slug,
                display_order: 1,
                content: formData,
            });
        } else {
            await supabase
                .from(table)
                .update({
                    content: formData,
                    display_order: 1,
                })
                .eq("section_slug", section.slug);
        }
    }

    /* ----------------------------------------------------------------------
     * CASE 3 — SINGLE ROW — OTHER TABLES
     * ---------------------------------------------------------------------- */
    else {
        if (rows.length === 0) {
            await supabase.from(table).insert({
                section_slug: section.slug,
                content: formData,
            });
        } else {
            await supabase
                .from(table)
                .update({ content: formData })
                .eq("id", rows[0].id);
        }
    }

    /* ----------------------------------------------------------------------
     * METADATA UPDATE
     * ---------------------------------------------------------------------- */
    await supabase
        .from("site_sections")
        .update({
            title,
            icon,
            is_active: isVisible,
        })
        .eq("id", section.id);
}

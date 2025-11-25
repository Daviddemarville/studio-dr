"use client";

import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { TemplateWithSlug } from "@/templates/sections/loader.server";
import { getTemplate } from "@/templates/sections/loader.server";
import IconSelector from "../../components/IconSelector";
import PreviewSite from "../../components/PreviewSite";
import TeamVisibilityManager from "../../components/TeamVisibilityManager";
import OpenPreviewButton from "../../components/ui/OpenPreviewButton";
import renderDynamicField from "../renderDynamicField";

interface TemplateFieldBase {
  type: string;
  name: string;
  label?: string;
}

interface TemplateFieldSingle extends TemplateFieldBase {
  type: "text" | "textarea" | "number" | "image";
}

interface TemplateFieldRepeater extends TemplateFieldBase {
  type: "repeater";
  fields: TemplateFieldSingle[];
  min?: number;
  max?: number;
}

// type TemplateField = TemplateFieldSingle | TemplateFieldRepeater; // Removed unused type alias

interface SiteSection {
  id: number;
  slug: string;
  title: string;
  table_name: string;
  template_slug: string | null;
  is_active: boolean;
  icon: string;
}

interface DBRow {
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

export default function SectionEditorWrapper({ slug }: { slug: string }) {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [section, setSection] = useState<SiteSection | null>(null);
  const [template, setTemplate] = useState<TemplateWithSlug | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [rows, setRows] = useState<DBRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Local state for UI
  const [title, setTitle] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [icon, setIcon] = useState("FileText");

  // --------------------------------------------------------------------------
  // Load section, template and rows
  // --------------------------------------------------------------------------
  const load = async () => {
    setLoading(true);
    // SECTION
    const { data: sectionData } = await supabase
      .from("site_sections")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!sectionData) {
      setMessage("Section introuvable");
      setLoading(false);
      return;
    }
    setSection(sectionData);
    setTitle(sectionData.title);
    setIsVisible(sectionData.is_active);
    setIcon(sectionData.icon || "FileText");

    // TEMPLATE
    const tpl = sectionData.template_slug
      ? await getTemplate(sectionData.template_slug)
      : null;
    setTemplate(tpl);

    // ROWS
    let query = supabase.from(sectionData.table_name).select("*");
    if (sectionData.table_name === "users") {
      // fetch all users (admin can toggle is_public)
      query = query.eq("is_approved", true);
    } else if (
      ["content_offers", "content_pricing"].includes(sectionData.table_name)
    ) {
      query = query.order("display_order", { ascending: true });
    } else if (sectionData.table_name === "content_workflow_steps") {
      query = query.order("step_number", { ascending: true });
    }
    const { data: rowsData } = await query;
    const fetchedRows: DBRow[] = rowsData ?? [];
    setRows(fetchedRows);

    // FORM DATA
    if (!tpl) {
      setLoading(false);
      return;
    }
    const repeaterField = tpl.fields.find((f) => f.type === "repeater") as
      | TemplateFieldRepeater
      | undefined;
    if (repeaterField) {
      const valueArray = fetchedRows.map((row) => {
        const base = row.content ?? {};
        return {
          ...base,
          id: row.id,
          ...(row.price_ht !== undefined && { price_ht: row.price_ht }),
          ...(row.price_ttc !== undefined && { price_ttc: row.price_ttc }),
          ...(row.tva_rate !== undefined && { tva_rate: row.tva_rate }),
          ...(row.offer_id !== undefined && { offer_id: row.offer_id }),
        };
      });
      setFormData({ [repeaterField.name]: valueArray });
    } else {
      const row = fetchedRows[0] ?? { content: {} };
      if (sectionData.table_name === "users") {
        setFormData(row);
      } else {
        setFormData(row.content ?? {});
      }
    }
    setLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load function is stable, slug change should trigger reload
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // --------------------------------------------------------------------------
  // Save logic
  // --------------------------------------------------------------------------
  const save = async () => {
    if (!section || !template || !formData) return;
    const table = section.table_name;
    const repeaterField = template.fields.find((f) => f.type === "repeater") as
      | TemplateFieldRepeater
      | undefined;

    if (repeaterField) {
      // biome-ignore lint/suspicious/noExplicitAny: Dynamic data structure
      const items = (formData as any)[repeaterField.name] as Record<
        string,
        unknown
      >[];
      const currentIds: string[] = [];

      if (items && Array.isArray(items)) {
        // Process items for repeater fields
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const contentFields: Record<string, unknown> = {};
          repeaterField.fields.forEach((f) => {
            const fieldName = f.name;
            if (["text", "textarea", "number", "image"].includes(f.type)) {
              contentFields[fieldName] = item[fieldName];
            }
          });

          // biome-ignore lint/suspicious/noExplicitAny: Dynamic payload construction
          const payload: any = {
            section_slug: slug,
            content: contentFields,
          };

          // Specific mapping for known tables
          if (["content_offers", "content_pricing"].includes(table))
            payload.display_order = i + 1;
          if (table === "content_workflow_steps") payload.step_number = i + 1;
          if (table === "users") delete payload.section_slug; // Users table doesn't use section_slug for rows

          // Additional fields for specific tables
          // biome-ignore lint/suspicious/noExplicitAny: Dynamic item access
          const itemAny = item as any;
          if (itemAny.price_ht !== undefined)
            payload.price_ht = itemAny.price_ht;
          if (itemAny.price_ttc !== undefined)
            payload.price_ttc = itemAny.price_ttc;
          if (itemAny.tva_rate !== undefined)
            payload.tva_rate = itemAny.tva_rate;
          if (itemAny.offer_id !== undefined)
            payload.offer_id = itemAny.offer_id;

          if (item.id) {
            // Update existing item
            await supabase.from(table).update(payload).eq("id", item.id);
            currentIds.push(item.id as string);
          } else {
            // Insert new item
            const { data: inserted } = await supabase
              .from(table)
              .insert(payload)
              .select("id")
              .single();
            // biome-ignore lint/suspicious/noExplicitAny: Dynamic result access
            if (inserted) currentIds.push((inserted as any).id);
          }
        }

        // Delete removed items
        const initialIds = rows.map((r) => r.id);
        const toDelete = initialIds.filter((id) => !currentIds.includes(id));
        if (toDelete.length > 0)
          await supabase.from(table).delete().in("id", toDelete);
      }
    } else {
      // SIMPLE (single row) or non-repeater content
      if (table === "content_custom_sections") {
        // Save content directly into the 'content' JSON field of the section
        const { error } = await supabase
          .from(table)
          .update({ content: formData })
          .eq("slug", slug);

        if (error) throw error;
      } else {
        // Save into a specific table row
        if (rows.length === 0) {
          // Insert new row if none exists
          const { error } = await supabase
            .from(table)
            .insert({ section_slug: slug, content: formData });
          if (error) throw error;
        } else {
          // Update existing row
          const row = rows[0];
          // biome-ignore lint/suspicious/noExplicitAny: Dynamic payload
          const updatePayload: any = { content: formData };
          if (table === "users") {
            // For 'users' table, fields are directly on the row, not nested in 'content'
            Object.keys(formData).forEach((key) => {
              // biome-ignore lint/suspicious/noExplicitAny: Dynamic access
              (updatePayload as any)[key] = (formData as any)[key];
            });
            delete updatePayload.content; // Remove content field if direct mapping
          }

          const { error } = await supabase
            .from(table)
            .update(updatePayload)
            .eq("id", row.id);

          if (error) throw error;
        }
      }
    }

    // METADATA UPDATE (always update section metadata)
    await supabase
      .from("site_sections")
      .update({
        title: title,
        is_active: isVisible,
        icon: icon,
      })
      .eq("id", section.id);

    alert("Sauvegardé avec succès");
    router.refresh(); // Refresh the page to reflect changes
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  if (loading) return <div className="p-8 text-neutral-400">Chargement...</div>;
  if (!template)
    return <div className="p-8 text-red-400">Template non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Layers className="text-blue-500" />
          Édition : {section?.title}
        </h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-400">
            Visible
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="ml-2 rounded bg-neutral-800 border-neutral-700"
            />
          </label>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 shadow-xl">
        {/* METADATA EDITOR */}
        <div className="border-b border-neutral-800 pb-6 mb-2">
          <label className="block text-sm text-neutral-400 mb-1">
            Titre de la section
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
            />
          </label>
          <div className="mt-4">
            <IconSelector
              value={icon}
              onChange={(iconName) => setIcon(iconName)}
            />
          </div>
        </div>

        {/* CONTENT EDITOR */}
        {section?.table_name === "users" ? (
          <TeamVisibilityManager />
        ) : (
          template.fields.map((field) => (
            <div key={field.name}>
              {renderDynamicField({
                field,
                // biome-ignore lint/suspicious/noExplicitAny: Dynamic form data
                value: (formData as any)[field.name],
                onChange: (newVal) =>
                  setFormData({
                    // biome-ignore lint/suspicious/noExplicitAny: Dynamic form data
                    ...(formData as any),
                    [field.name]: newVal,
                  }),
              })}
            </div>
          ))
        )}

        <button
          type="button"
          onClick={save}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Sauvegarder
        </button>
        {message && <p className="text-green-400 mt-2">{message}</p>}
      </div>

      <div className="hidden md:block">
        <PreviewSite />
      </div>
      <div className="mt-4 flex justify-end md:hidden">
        <OpenPreviewButton href="/" />
      </div>
    </div>
  );
}

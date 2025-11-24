"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import renderDynamicField from "../renderDynamicField";
import { getTemplate } from "@/templates/sections/loader.server";
import type { TemplateWithSlug } from "@/templates/sections/loader.server";
import OpenPreviewButton from "../../components/ui/OpenPreviewButton";
import PreviewSite from "../../components/PreviewSite";
import IconSelector from "../../components/IconSelector";
import TeamVisibilityManager from "../../components/TeamVisibilityManager";

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

type TemplateField = TemplateFieldSingle | TemplateFieldRepeater;

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

  const [section, setSection] = useState<SiteSection | null>(null);
  const [template, setTemplate] = useState<TemplateWithSlug | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null);
  const [rows, setRows] = useState<DBRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

    // TEMPLATE
    const tpl = sectionData.template_slug ? await getTemplate(sectionData.template_slug) : null;
    setTemplate(tpl);

    // ROWS
    let query = supabase.from(sectionData.table_name).select("*");
    if (sectionData.table_name === "users") {
      // fetch all users (admin can toggle is_public)
      query = query.eq("is_approved", true);
    } else if (["content_offers", "content_pricing"].includes(sectionData.table_name)) {
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
    const repeaterField = tpl.fields.find((f) => f.type === "repeater") as TemplateFieldRepeater | undefined;
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

  useEffect(() => {
    load();
  }, [slug]);

  // --------------------------------------------------------------------------
  // Save logic
  // --------------------------------------------------------------------------
  const save = async () => {
    if (!section || !template || !formData) return;
    const table = section.table_name;
    const repeaterField = template.fields.find((f) => f.type === "repeater") as TemplateFieldRepeater | undefined;

    if (repeaterField) {
      const items = (formData as any)[repeaterField.name] as Record<string, unknown>[];
      const currentIds: string[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const contentFields: Record<string, unknown> = {};
        repeaterField.fields.forEach((f) => {
          const fieldName = f.name;
          if (["text", "textarea", "number", "image"].includes(f.type)) {
            contentFields[fieldName] = item[fieldName];
          }
        });
        const payload: any = {
          section_slug: slug,
          content: contentFields,
        };
        if (["content_offers", "content_pricing"].includes(table)) payload.display_order = i + 1;
        if (table === "content_workflow_steps") payload.step_number = i + 1;
        if (table === "users") delete payload.section_slug;
        if ((item as any).price_ht !== undefined) payload.price_ht = (item as any).price_ht;
        if ((item as any).price_ttc !== undefined) payload.price_ttc = (item as any).price_ttc;
        if ((item as any).tva_rate !== undefined) payload.tva_rate = (item as any).tva_rate;
        if ((item as any).offer_id !== undefined) payload.offer_id = (item as any).offer_id;
        if (item.id) {
          await supabase.from(table).update(payload).eq("id", item.id);
          currentIds.push(item.id as string);
        } else {
          const { data: inserted } = await supabase.from(table).insert(payload).select("id").single();
          if (inserted) currentIds.push((inserted as any).id);
        }
      }
      const initialIds = rows.map((r) => r.id);
      const toDelete = initialIds.filter((id) => !currentIds.includes(id));
      if (toDelete.length > 0) await supabase.from(table).delete().in("id", toDelete);
      setMessage("Section sauvegardée.");
      load();
      return;
    }

    // SIMPLE (single row)
    if (rows.length === 0) {
      const { error } = await supabase.from(table).insert({ section_slug: slug, content: formData });
      setMessage(error ? error.message : "Section créée.");
    } else {
      const row = rows[0];
      const updatePayload: any = { content: formData };
      if (table === "users") {
        Object.keys(formData).forEach((key) => {
          (updatePayload as any)[key] = (formData as any)[key];
        });
        delete updatePayload.content;
      }
      const { error } = await supabase.from(table).update(updatePayload).eq("id", row.id);
      setMessage(error ? error.message : "Section sauvegardée.");
    }

    // METADATA UPDATE
    await supabase
      .from("site_sections")
      .update({ title: section.title, is_active: section.is_active, icon: section.icon })
      .eq("id", section.id);
    load();
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  if (loading || !section || !template || !formData) {
    return <p className="text-neutral-400">Chargement...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Édition : {section.title}</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-400">Visible</label>
          <input
            type="checkbox"
            checked={section.is_active}
            onChange={(e) => setSection({ ...section, is_active: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="bg-neutral-900 p-6 rounded-lg flex flex-col gap-6">
        {/* METADATA EDITOR */}
        <div className="border-b border-neutral-800 pb-6 mb-2">
          <label className="block text-sm text-neutral-400 mb-1">Titre de la section</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => setSection({ ...section, title: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
          />
          <div className="mt-4">
            <IconSelector
              value={section.icon || "FileText"}
              onChange={(iconName) => setSection({ ...section, icon: iconName })}
            />
          </div>
        </div>

        {/* CONTENT EDITOR */}
        {section.table_name === "users" ? (
          <TeamVisibilityManager />
        ) : (
          <>
            {template.fields.map((field) => (
              <div key={field.name}>
                {renderDynamicField({
                  field,
                  value: (formData as any)[field.name],
                  onChange: (newVal) =>
                    setFormData({
                      ...(formData as any),
                      [field.name]: newVal,
                    }),
                })}
              </div>
            ))}
          </>
        )}

        <button onClick={save} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
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

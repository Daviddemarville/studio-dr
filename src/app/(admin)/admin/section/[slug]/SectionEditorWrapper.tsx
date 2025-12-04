"use client";

import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import IconSelector from "../../components/IconSelector";
import PreviewSite from "../../components/PreviewSite";
import TeamVisibilityManager from "../../components/TeamVisibilityManager";
import OpenPreviewButton from "../../components/ui/OpenPreviewButton";
import renderDynamicField from "../renderDynamicField";

// WRAPPERS
import { loadSection } from "./wrappers/SectionLoadWrapper";
import { saveSection } from "./wrappers/SectionSaveWrapper";

export default function SectionEditorWrapper({ slug }: { slug: string }) {
  const router = useRouter();

  const [section, setSection] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("FileText");
  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState(true);

  /* --------------------------------------------------------------------------
   * LOAD
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    async function fetchData() {
      const data = await loadSection(slug);
      setSection(data.section);
      setTemplate(data.template);
      setRows(data.rows);
      setFormData(data.formData);

      setTitle(data.section.title);
      setIcon(data.section.icon);
      setIsVisible(data.section.is_active);

      setLoading(false);
    }
    fetchData();
  }, [slug]);

  /* --------------------------------------------------------------------------
   * SAVE
   * -------------------------------------------------------------------------- */
  const handleSave = async () => {
    await saveSection({
      section,
      template,
      formData,
      rows,
      title,
      icon,
      isVisible,
    });

    alert("Sauvegardé");
    router.refresh();
  };

  /* --------------------------------------------------------------------------
   * UI
   * -------------------------------------------------------------------------- */

  if (loading) return <div className="p-6 text-neutral-400">Chargement...</div>;
  if (!template)
    return <div className="p-6 text-red-400">Template non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Layers className="text-blue-500" /> Édition : {section.title}
        </h1>

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

      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
        {/* METADATA */}
        <div className="border-b border-neutral-800 pb-6 mb-6">
          <label className="block text-sm text-neutral-400">
            Titre
            <input
              className="w-full mt-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="mt-4">
            <IconSelector value={icon} onChange={setIcon} />
          </div>
        </div>

        {/* CONTENT */}
        {section.table_name === "users" ? (
          <TeamVisibilityManager />
        ) : (
          template.fields.map((field: any) => (
            <div key={field.name}>
              {renderDynamicField({
                field,
                value: formData[field.name],
                tableName: section.table_name,
                sectionSlug: section.slug,
                onChange: (val) =>
                  setFormData((prev: any) => {
                    // CAS 1 — REPEATER (array)
                    if (Array.isArray(val)) {
                      return {
                        ...prev,
                        [field.name]: val.map((item: any) => {
                          const previous = prev[field.name]?.find(
                            (p: any) => p._id === item._id,
                          );
                          return previous?.id
                            ? { ...item, id: previous.id }
                            : item;
                        }),
                      };
                    }

                    // CAS 2 — SIMPLE FIELD (string, number, image, textarea)
                    return {
                      ...prev,
                      [field.name]: val,
                    };
                  }),
              })}
            </div>
          ))
        )}

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Sauvegarder les modifications
        </button>
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

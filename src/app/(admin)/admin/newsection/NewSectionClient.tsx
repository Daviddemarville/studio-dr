"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import IconSelector from "../components/IconSelector";
import { createSection, deleteSection, updateSectionPosition } from "./actions";

interface Template {
  slug: string;
  name: string;
  description?: string;
}

interface Section {
  id: number;
  title: string;
  slug: string;
  template_slug: string | null;
  table_name: string;
  is_active: boolean;
  position: number;
}

export default function NewSectionClient({
  templates,
  sections,
}: {
  templates: Template[];
  sections: Section[];
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState("FileText");
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates[0]?.slug || "",
  );

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette section ? Tout le contenu associé sera perdu.",
      )
    )
      return;
    try {
      const result = await deleteSection(id);
      if (result.success) {
        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (_e) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const result = await createSection(
        title,
        selectedTemplate,
        position,
        selectedIcon,
      );
      if (result.success) {
        setTitle("");
        setPosition(0);
        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (_e) {
      alert("Erreur lors de la création");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePositionUpdate = async (id: number, newPos: number) => {
    try {
      const result = await updateSectionPosition(id, newPos);
      if (result.success) {
        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        alert(`Erreur de mise à jour de la position: ${result.error}`);
      }
    } catch (_e) {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-8">
      {/* FORMULAIRE DE CRÉATION */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Ajouter une nouvelle section
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm text-neutral-400 mb-1">
                Nom de la section
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
                  placeholder="Ex: Nos Services"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-400">
                Position
                <input
                  type="number"
                  value={position}
                  onChange={(e) =>
                    setPosition(parseInt(e.target.value, 10) || 0)
                  }
                  className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white w-24 mt-1"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm text-neutral-400 mb-1">
                Modèle (Template)
                <select
                  required
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
                >
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-xs text-neutral-500 mt-1">
                {templates.find((t) => t.slug === selectedTemplate)
                  ?.description || ""}
              </p>
            </div>
          </div>

          <IconSelector value={selectedIcon} onChange={setSelectedIcon} />

          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isCreating ? "Création..." : "Créer la section"}
          </button>
        </form>
      </div>

      {/* LISTE DES SECTIONS EXISTANTES */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Sections existantes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-neutral-800 text-neutral-200 uppercase">
              <tr>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-neutral-800/50">
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={section.position}
                      onBlur={(e) =>
                        handlePositionUpdate(
                          section.id,
                          parseInt(e.target.value, 10) || 0,
                        )
                      }
                      className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-center"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {section.title}
                  </td>
                  <td className="px-4 py-3">{section.slug}</td>
                  <td className="px-4 py-3">{section.table_name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(section.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {sections.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    Aucune section trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

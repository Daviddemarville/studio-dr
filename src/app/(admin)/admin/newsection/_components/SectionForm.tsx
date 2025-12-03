"use client";

import IconSelector from "../../components/IconSelector";
import PreviewButton from "./PreviewButton";

interface Template {
    slug: string;
    name: string;
    description?: string;
}

export default function SectionForm({
    templates,
    isCreating,
    title,
    position,
    selectedIcon,
    selectedTemplate,
    setTitle,
    setPosition,
    setIcon,
    setTemplate,
    onSubmit,
}: {
    templates: Template[];
    isCreating: boolean;
    title: string;
    position: number;
    selectedIcon: string;
    selectedTemplate: string;
    setTitle: (v: string) => void;
    setPosition: (v: number) => void;
    setIcon: (v: string) => void;
    setTemplate: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}) {

    const adminTemplates = ["section_user_profile"];

    const filteredTemplates = templates.filter(
        (t) => !adminTemplates.includes(t.slug)
    );

    const selectedTemplateMeta =
        templates.find((t) => t.slug === selectedTemplate) || null;

    return (
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
            <h2 className="text-xl font-semibold mb-4 text-white">
                Ajouter une nouvelle section
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">

                {/* TITLE + POSITION */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm text-neutral-400 mb-1">
                            Nom de la section
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Nos Services"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
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

                {/* TEMPLATE */}
                <div>
                    <label className="block text-sm text-neutral-400 mb-1">
                        Modèle (Template)
                        <select
                            required
                            value={selectedTemplate}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
                        >
                            {filteredTemplates.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <p className="text-xs text-neutral-500 mt-1">
                        {selectedTemplateMeta?.description || ""}
                    </p>
                </div>

                {/* ICON SELECTOR */}
                <IconSelector value={selectedIcon} onChange={setIcon} />

                {/* PREVIEW */}
                <PreviewButton templateSlug={selectedTemplate} />

                {/* SUBMIT */}
                <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {isCreating ? "Création..." : "Créer la section"}
                </button>
            </form>
        </div>
    );
}

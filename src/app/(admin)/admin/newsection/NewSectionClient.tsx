"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSection, deleteSection, updateSectionPosition } from "./actions";
import IconSelector from "../components/IconSelector";

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
        templates[0]?.slug || ""
    );

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                "Êtes-vous sûr de vouloir supprimer cette section ? Tout le contenu associé sera perdu."
            )
        )
            return;
        try {
            const result = await deleteSection(id);
            if (result.success) {
                window.dispatchEvent(new Event("refresh-nav"));
                router.refresh();
            } else {
                alert("Erreur: " + result.error);
            }
        } catch (e) {
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
                selectedIcon
            );
            if (result.success) {
                setTitle("");
                setPosition(0);
                setSelectedIcon("FileText");
                window.dispatchEvent(new Event("refresh-nav"));
                router.refresh();
            } else {
                alert("Erreur: " + result.error);
            }
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handlePositionUpdate = async (id: number, newPos: number) => {
        const result = await updateSectionPosition(id, newPos);
        if (result.success) {
            window.dispatchEvent(new Event("refresh-nav"));
            router.refresh();
        } else {
            alert("Erreur de mise à jour de la position: " + result.error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Form to create a new section */}
            <div className="bg-neutral-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Ajouter une section</h2>
                <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm text-neutral-400 mb-1">Nom de la section</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Nos Services"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-400">Position</label>
                        <input
                            type="number"
                            value={position}
                            onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
                            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white w-24"
                        />
                    </div>

                    <div className="flex-1 w-full">
                        <label className="block text-sm text-neutral-400 mb-1">Modèle (Template)</label>
                        <select
                            required
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
                        >
                            <option value="">Choisir un modèle...</option>
                            {templates.map((t) => (
                                <option key={t.slug} value={t.slug}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 w-full">
                        <IconSelector value={selectedIcon} onChange={setSelectedIcon} />
                    </div>

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {isCreating ? "Création..." : "Ajouter"}
                    </button>
                </form>
            </div>

            {/* Existing sections list */}
            <div className="bg-neutral-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-4">Sections existantes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="bg-neutral-800 text-neutral-200 uppercase">
                            <tr>
                                <th className="px-4 py-3">Titre</th>
                                <th className="px-4 py-3">Position</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Modèle</th>
                                <th className="px-4 py-3">Table</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {sections.map((section) => (
                                <tr key={section.id} className="hover:bg-neutral-800/50">
                                    <td className="px-4 py-3 font-medium text-white">{section.title}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={section.position}
                                            onChange={(e) =>
                                                handlePositionUpdate(
                                                    section.id,
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white"
                                        />
                                    </td>
                                    <td className="px-4 py-3">{section.slug}</td>
                                    <td className="px-4 py-3">{section.template_slug}</td>
                                    <td className="px-4 py-3">{section.table_name}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
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
                                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
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

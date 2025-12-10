"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./_components/ConfirmModal";
import SectionForm from "./_components/SectionForm";
import SectionList from "./_components/SectionList";
import SectionReorder from "./_components/SectionReorder";
import { useConfirm } from "./_components/useConfirm";
import { createSection, deleteSection, reorderSections } from "./actions";

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
  icon: string | null;
}

export default function NewSectionClient({
  templates,
  sections,
}: {
  templates: Template[];
  sections: Section[];
}) {
  const router = useRouter();
  const { isOpen, options, openConfirm, confirm, cancel } = useConfirm();

  // FORM STATE
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState("FileText");
  const [selectedTemplate, setSelectedTemplate] = useState(
    templates[0]?.slug || "",
  );

  // ============================================================
  // CREATION
  // ============================================================
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
        toast.success("Section créée avec succès !");
        setTitle("");
        setPosition(0);

        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch {
      toast.error("Erreur interne lors de la création");
    } finally {
      setIsCreating(false);
    }
  };

  // ============================================================
  // SUPPRESSION
  // ============================================================
  const handleDelete = async (id: number) => {
    const confirmed = await openConfirm({
      title: "Supprimer cette section",
      message:
        "Êtes-vous sûr de vouloir supprimer cette section ? Le contenu associé sera perdu.",
    });

    if (!confirmed) return;

    try {
      const result = await deleteSection(id);

      if (result.success) {
        toast.success("Section supprimée !");
        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch {
      toast.error("Erreur interne lors de la suppression");
    }
  };

  return (
    <div className="space-y-8">
      <SectionForm
        templates={templates}
        isCreating={isCreating}
        title={title}
        position={position}
        selectedIcon={selectedIcon}
        selectedTemplate={selectedTemplate}
        setTitle={setTitle}
        setPosition={setPosition}
        setIcon={setSelectedIcon}
        setTemplate={setSelectedTemplate}
        onSubmit={handleCreate}
      />

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Réorganisation des sections
        </h2>

        <SectionReorder
          sections={sections}
          onReorder={async (orderedIds) => {
            try {
              await reorderSections(orderedIds);
              toast.success("Ordre mis à jour !");
              window.dispatchEvent(new Event("refresh-nav"));
              router.refresh();
            } catch (_error) {
              toast.error("Erreur lors de la mise à jour de l'ordre.");
            }
          }}
        />
      </div>

      <SectionList sections={sections} onDelete={handleDelete} />
      <ConfirmModal
        open={isOpen}
        title={options.title}
        message={options.message}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </div>
  );
}

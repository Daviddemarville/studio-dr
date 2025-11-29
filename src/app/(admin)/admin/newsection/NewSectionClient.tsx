"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { createSection, deleteSection, updateSectionPosition } from "./actions";
import SectionForm from "./_components/SectionForm";
import SectionList from "./_components/SectionList";
import ConfirmModal from "./_components/ConfirmModal";
import { useConfirm } from "./_components/useConfirm";


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
  const { isOpen, options, openConfirm, closeConfirm } = useConfirm();

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
    const confirmed = await openConfirm(
      "Supprimer cette section",
      "Êtes-vous sûr de vouloir supprimer cette section ? Le contenu associé sera perdu."
    );

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

  // ============================================================
  // MISE À JOUR DE POSITION
  // ============================================================
  const handlePositionUpdate = async (id: number, newPos: number) => {
    try {
      const result = await updateSectionPosition(id, newPos);

      if (result.success) {
        toast.success("Position mise à jour !");
        window.dispatchEvent(new Event("refresh-nav"));
        router.refresh();
      } else {
        toast.error(`Erreur de mise à jour : ${result.error}`);
      }
    } catch {
      toast.error("Erreur interne lors de la mise à jour");
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

      <SectionList
        sections={sections}
        onDelete={handleDelete}
        onPositionUpdate={handlePositionUpdate}
      />
      <ConfirmModal
        open={isOpen}
        title={options.title}
        message={options.message}
        onConfirm={() => {
          options.onConfirm?.();
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </div>
  );

}

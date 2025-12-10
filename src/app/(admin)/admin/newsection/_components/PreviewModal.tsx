"use client";

import { useEffect, useState } from "react";
import type {
  NewSectionTemplate,
  PreviewModalProps,
  PreviewTemplate,
} from "@/types/newsection";
import { getTemplate } from "../../../../../templates/sections/loader.server";
import TemplatePreview from "./TemplatePreview";

/* ----------------------------------------------------------
 * Convertit un NewSectionTemplate → PreviewTemplate
 * ---------------------------------------------------------- */
function toPreviewTemplate(
  raw: NewSectionTemplate | null,
): PreviewTemplate | null {
  if (!raw) return null;

  return {
    name: raw.name,
    description: raw.description,
    fields: raw.fields, // déjà typés via Zod
  };
}

/* ----------------------------------------------------------
 * PreviewModal (corrigé)
 * ---------------------------------------------------------- */
export default function PreviewModal({
  open,
  onClose,
  templateSlug,
}: PreviewModalProps) {
  const [template, setTemplate] = useState<PreviewTemplate | null>(null);

  useEffect(() => {
    if (open && templateSlug) {
      getTemplate(templateSlug).then((raw) =>
        setTemplate(toPreviewTemplate(raw)),
      );
    }
  }, [open, templateSlug]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="w-[90vw] md:w-[80vw] max-h-[85vh] overflow-y-auto bg-neutral-900 rounded-lg p-8 shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Prévisualisation du template
          </h2>

          <button
            type="button"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        {!template && <p className="text-neutral-400 text-sm">Chargement...</p>}

        {template && <TemplatePreview template={template} />}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { TemplateType } from "@/types/public";
import { getTemplate } from "../../../../../templates/sections/loader.server";
import TemplatePreview from "./TemplatePreview";

export default function PreviewModal({
  open,
  onClose,
  templateSlug,
}: TemplateType) {
  const [template, setTemplate] = useState<TemplateType | null>(null);

  useEffect(() => {
    if (open && templateSlug) {
      // Appel server → charge le template complet
      getTemplate(templateSlug).then(setTemplate);
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

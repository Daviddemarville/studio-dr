"use client";

import { ExternalLink } from "lucide-react";

type Props = {
  href: string;
  label?: string;
};

export default function OpenPreviewButton({
  href,
  label = "Ouvrir dans un nouvel onglet",
}: Props) {
  return (
    <button
    type="button"
      onClick={() => window.open(href, "_blank")}
      className="inline-flex items-center gap-2 rounded-md border border-neutral-600 bg-neutral-700/40 px-2.5 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:border-neutral-500 transition"
    >
      <ExternalLink className="w-4 h-4" />
      {label}
    </button>
  );
}

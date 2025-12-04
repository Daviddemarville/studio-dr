"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SectionListItem({
  section,
  onDelete,
  isOpen,
  onToggle,
}: {
  section: {
    id: number;
    title: string;
    slug: string;
    table_name: string;
    position: number;
    is_active?: boolean;
  };
  onDelete: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isActive = section.is_active !== false; // true si non présent

  return (
    <div className="border border-neutral-800 bg-neutral-800 rounded-lg">
      {/* Barre principale */}
      <div
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-700/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {/* Badge actif/inactif */}
          <span
            className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${
                              isActive
                                ? "bg-green-700/40 text-green-300 border border-green-700/60"
                                : "bg-red-700/40 text-red-300 border border-red-700/60"
                            }
                        `}
          >
            {isActive ? "Actif" : "Inactif"}
          </span>

          <span className="text-neutral-200 font-medium">{section.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(section.id);
            }}
            className="text-red-400 hover:text-red-300 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Chevron */}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </div>

      {/* Contenu ouvert */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 mt-1 text-neutral-300 space-y-2"
        >
          <p>
            <span className="text-neutral-500">Slug :</span> {section.slug}
          </p>
          <p>
            <span className="text-neutral-500">Table :</span>{" "}
            {section.table_name}
          </p>
          <p>
            <span className="text-neutral-500">Position :</span>{" "}
            {section.position}
          </p>

          <Link
            href={`/admin/sections/${section.slug}`}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Aller à la section →
          </Link>
        </motion.div>
      )}
    </div>
  );
}

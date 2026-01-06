"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { toggleShowInNav } from "../actions";

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
    show_in_nav?: boolean;
  };
  onDelete: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isActive = section.is_active !== false; // true si non présent
  const [showInNav, setShowInNav] = useState(section.show_in_nav !== false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleNav = async () => {
    setIsUpdating(true);
    const newValue = !showInNav;

    try {
      const result = await toggleShowInNav(section.id, newValue);

      if (result.success) {
        setShowInNav(newValue);
        toast.success(
          newValue
            ? "Section affichée dans la navbar"
            : "Section masquée de la navbar",
        );
        window.dispatchEvent(new Event("refresh-nav"));
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border border-neutral-800 bg-neutral-800 rounded-lg">
      {/* Barre principale */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-700/50 transition text-left"
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

            <span className="text-neutral-200 font-medium">
              {section.title}
            </span>
          </div>

          {/* Chevron */}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {/* Toggle Nav Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleNav();
          }}
          disabled={isUpdating}
          className={`ml-3 transition ${
            showInNav
              ? "text-blue-400 hover:text-blue-300"
              : "text-gray-500 hover:text-gray-400"
          } disabled:opacity-50`}
          title={showInNav ? "Masquer de la navbar" : "Afficher dans la navbar"}
        >
          {showInNav ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section.id);
          }}
          className="ml-3 text-red-400 hover:text-red-300 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
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
          <p>
            <span className="text-neutral-500">Affichée dans la navbar :</span>{" "}
            <span className={showInNav ? "text-green-400" : "text-red-400"}>
              {showInNav ? "Oui" : "Non"}
            </span>
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

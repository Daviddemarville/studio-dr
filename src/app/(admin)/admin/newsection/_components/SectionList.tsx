"use client";

import { useState } from "react";
import SectionListItem from "./SectionListItem";

interface Section {
  id: number;
  title: string;
  slug: string;
  table_name: string;
  position: number;
}

export default function SectionList({
  sections,
  onDelete,
  onPositionUpdate,
}: {
  sections: Section[];
  onDelete: (id: number) => void;
  onPositionUpdate: (id: number, position: number) => void;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Gérer les sections
      </h2>

      <div className="space-y-3">
        {sections.length > 0 ? (
          sections.map((section) => (
            <SectionListItem
              key={section.id}
              section={section}
              onDelete={onDelete}
              isOpen={openId === section.id}
              onToggle={() =>
                setOpenId(openId === section.id ? null : section.id)
              }
            />
          ))
        ) : (
          <p className="text-neutral-500 text-center py-6">
            Aucune section trouvée.
          </p>
        )}
      </div>
    </div>
  );
}

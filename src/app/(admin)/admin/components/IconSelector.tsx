"use client";

import { SECTION_ICONS } from "@/lib/section-icons";

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const iconNames = Object.keys(SECTION_ICONS);

  return (
    <div className="space-y-2">
      <p className="block text-sm text-neutral-400">Icône de la section</p>
      <div className="grid grid-cols-9 gap-2">
        {iconNames.map((iconName) => {
          const IconComponent = SECTION_ICONS[iconName];
          const isSelected = value === iconName;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                }
              `}
              title={iconName}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-xs text-neutral-500">Icône sélectionnée : {value}</p>
      )}
    </div>
  );
}

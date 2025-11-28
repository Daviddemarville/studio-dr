"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import RepeaterEditor from "./RepeaterEditor";

export default function renderDynamicField({
  field,
  value,
  tableName,
  sectionSlug,
  onChange,
  onRelationChange,
}: {
  field: any;
  value: any;
  tableName?: string;
  sectionSlug?: string;
  onChange: (value: any) => void;
  onRelationChange?: (selectedItem: any) => void;
}) {
  // Champs non modifiables (titre auto + TTC auto)
  if (
    (field.name === "title_fr" ||
      field.name === "title_en" ||
      field.name === "price_ttc") &&
    typeof onChange === "function"
  ) {
    return (
      <div className="flex flex-col gap-1 opacity-60">
        <label className="text-sm text-white">
          {field.label as string}
          <input
            type="text"
            value={(value as string) || ""}
            readOnly
            disabled
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1 cursor-not-allowed"
          />
        </label>
      </div>
    );
  }

  // ---- TEXT INPUT ----
  if (field.type === "text") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label as string}
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>
      </div>
    );
  }

  // ---- TEXTAREA ----
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label as string}
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white min-h-20 mt-1"
          />
        </label>
      </div>
    );
  }

  // Valeur sécurisée pour les prévisualisations
  const safeValue = typeof value === "string" ? value : "";

  // ---- NUMBER ----
  if (field.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label as string}
          <input
            type="number"
            value={(value as number) || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>
      </div>
    );
  }

  // ---- IMAGE URL ----
  if (field.type === "image") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label as string}
          <input
            type="text"
            placeholder="https://..."
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>

        {typeof value === "string" && value.trim() !== "" && (
          <Image
            src={safeValue}
            alt="preview"
            width={96}
            height={96}
            className="w-24 h-auto rounded mt-2 border border-neutral-700"
          />
        )}
      </div>
    );
  }

  // ---- REPEATER ----
  if (field.type === "repeater") {
  return (
    <RepeaterEditor
      field={{
        ...field,
        table_name: tableName,
        section_slug: sectionSlug,
      }}
      value={value}
      onChange={onChange}
    />
  );
}

  // ---- RELATION ----
  if (field.type === "relation") {
    return (
      <RelationField
        field={field}
        value={value}
        onChange={onChange}
        onRelationChange={onRelationChange}
      />
    );
  }

  return (
    <p className="text-red-500 text-xs">
      Type de champ inconnu : {String(field.type)}
    </p>
  );
}

function RelationField({
  field,
  value,
  onChange,
  onRelationChange,
}: {
  field: Record<string, unknown>;
  value: unknown;
  onChange: (val: unknown) => void;
  onRelationChange?: (item: Record<string, unknown>) => void;
}) {
  const [options, setOptions] = useState<
    { label: string; value: string; original: Record<string, unknown> }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      const supabase = createClient();
      const tableName = field.relation_table as string;
      if (!tableName) return;

      const { data } = await supabase.from(tableName).select("id, content");

      if (data) {
        const opts = data.map(
          (row: { id: string; content: Record<string, unknown> }) => ({
            value: row.id,
            label:
              (row.content?.title_fr as string) ||
              (row.content?.title as string) ||
              "Sans titre",
            original: row,
          }),
        );
        setOptions(opts);
      }

      setLoading(false);
    };

    if (field.relation_table) {
      fetchOptions();
    }
  }, [field.relation_table]);

  if (loading) return <p className="text-xs text-neutral-500">Chargement...</p>;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-neutral-300">
        {field.label as string}
        <select
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100 mt-1"
          value={(value as string) ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val);

            if (onRelationChange) {
              const selected = options.find((o) => o.value === val);
              if (selected) onRelationChange(selected.original);
            }
          }}
        >
          <option value="">-- Sélectionner --</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

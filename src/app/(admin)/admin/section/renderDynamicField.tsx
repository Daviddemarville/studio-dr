"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

import type {
  FieldValueType,
  RepeaterItemType,
  SectionField,
  SectionFieldRelation,
  SectionFieldRepeater,
} from "@/types/section";

import RepeaterEditor from "./RepeaterEditor";

/* ==========================================================================
 * RENDER DYNAMIC FIELD
 * ========================================================================== */

export default function renderDynamicField({
  field,
  value,
  tableName,
  sectionSlug,
  onChange,
  onRelationChange,
}: {
  field: SectionField;
  value: FieldValueType;
  tableName?: string;
  sectionSlug?: string;
  onChange: (value: FieldValueType) => void;
  onRelationChange?: (row: Record<string, unknown>) => void;
}) {
  /* --------------------------------------------------------------------------
   * Champs non modifiables
   * -------------------------------------------------------------------------- */
  if (["title_fr", "title_en", "price_ttc"].includes(field.name)) {
    return (
      <div className="flex flex-col gap-1 opacity-60">
        <label className="text-sm text-white">
          {field.label}
          <input
            type="text"
            value={(value as string) ?? ""}
            readOnly
            disabled
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white mt-1 cursor-not-allowed"
          />
        </label>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
   * TEXT
   * -------------------------------------------------------------------------- */
  if (field.type === "text") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label}
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
   * TEXTAREA
   * -------------------------------------------------------------------------- */
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label}
          <textarea
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white min-h-20 mt-1"
          />
        </label>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
   * NUMBER
   * -------------------------------------------------------------------------- */
  if (field.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label}
          <input
            type="number"
            value={(value as number) ?? 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>
      </div>
    );
  }

  /* --------------------------------------------------------------------------
   * IMAGE (URL)
   * -------------------------------------------------------------------------- */
  if (field.type === "image") {
    const safeValue =
      typeof value === "string" && value.trim() !== "" ? value : "";

    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-300">
          {field.label}
          <input
            type="text"
            placeholder="https://..."
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-white mt-1"
          />
        </label>

        {safeValue && (
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

  /* --------------------------------------------------------------------------
   * REPEATER
   * -------------------------------------------------------------------------- */
  if (field.type === "repeater") {
    const repeater = field as SectionFieldRepeater;

    return (
      <RepeaterEditor
        field={{
          ...repeater,
          table_name: tableName,
          section_slug: sectionSlug,
        }}
        value={(value as RepeaterItemType[]) ?? []}
        onChange={onChange}
      />
    );
  }

  /* --------------------------------------------------------------------------
   * RELATION
   * -------------------------------------------------------------------------- */
  if (field.type === "relation") {
    return (
      <RelationField
        field={field as SectionFieldRelation}
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

/* ==========================================================================
 * COMPONENT — RELATION FIELD
 * ========================================================================== */

function RelationField({
  field,
  value,
  onChange,
  onRelationChange,
}: {
  field: SectionFieldRelation;
  value: FieldValueType;
  onChange: (v: FieldValueType) => void;
  onRelationChange?: (row: Record<string, unknown>) => void;
}) {
  const [options, setOptions] = useState<
    { value: string; label: string; original: Record<string, unknown> }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      const supabase = createClient();

      const { data } = await supabase
        .from(field.relation_table)
        .select("id, content");

      if (data) {
        setOptions(
          data.map((row: { id: string; content: Record<string, unknown> }) => ({
            value: row.id,
            label:
              (row.content?.title_fr as string) ??
              (row.content?.title as string) ??
              "Sans titre",
            original: row,
          })),
        );
      }

      setLoading(false);
    }

    fetchOptions();
  }, [field.relation_table]);

  if (loading) return <p className="text-xs text-neutral-500">Chargement...</p>;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-neutral-300">
        {field.label}
        <select
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100 mt-1"
          value={(value as string) ?? ""}
          onChange={(e) => {
            const selected = options.find((o) => o.value === e.target.value);
            onChange(e.target.value);

            if (selected && onRelationChange) {
              onRelationChange(selected.original);
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

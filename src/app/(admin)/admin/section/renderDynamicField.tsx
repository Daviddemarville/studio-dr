"use client";

import RepeaterEditor from "./RepeaterEditor";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function renderDynamicField({
  field,
  value,
  onChange,
  onRelationChange
}: {
  field: any;
  value: any;
  onChange: (value: any) => void;
  onRelationChange?: (selectedItem: any) => void;
}) {

  // ---- TEXT INPUT ----
  if (field.type === "text") {
    return (
      <div className="flex flex-col gap-1">
        {field.label && (
          <label className="text-sm text-neutral-300">{field.label}</label>
        )}
        <input
          type="text"
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // ---- TEXTAREA ----
  if (field.type === "textarea") {
    return (
      <div className="flex flex-col gap-1">
        {field.label && (
          <label className="text-sm text-neutral-300">{field.label}</label>
        )}
        <textarea
          rows={4}
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // ---- NUMBER ----
  if (field.type === "number") {
    return (
      <div className="flex flex-col gap-1">
        {field.label && (
          <label className="text-sm text-neutral-300">{field.label}</label>
        )}
        <input
          type="number"
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  // ---- IMAGE (simple placeholder d'upload) ----
  if (field.type === "image") {
    return (
      <div className="flex flex-col gap-1">
        {field.label && (
          <label className="text-sm text-neutral-300">{field.label}</label>
        )}

        <input
          type="file"
          accept="image/*"
          className="text-neutral-300"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onChange(file);
          }}
        />

        {value && typeof value === "string" && (
          <img
            src={value}
            alt="preview"
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
        field={field}
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

  return null;
}

function RelationField({
  field,
  value,
  onChange,
  onRelationChange
}: {
  field: any,
  value: any,
  onChange: (val: any) => void,
  onRelationChange?: (item: any) => void
}) {
  const [options, setOptions] = useState<{ label: string, value: string, original: any }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      const supabase = supabaseBrowser();
      // Assuming field.relation_table is defined in the template
      // For offers, we want the title as label.
      const { data } = await supabase
        .from(field.relation_table)
        .select("id, content");

      if (data) {
        const opts = data.map((row: any) => ({
          value: row.id,
          label: row.content?.title_fr || row.content?.title || "Sans titre",
          original: row
        }));
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
      {field.label && (
        <label className="text-sm text-neutral-300">{field.label}</label>
      )}
      <select
        className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-neutral-100"
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val);
          if (onRelationChange) {
            const selected = options.find(o => o.value === val);
            if (selected) onRelationChange(selected.original);
          }
        }}
      >
        <option value="">-- Sélectionner --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

"use client";

import type { TemplateFieldType } from "@/lib/zod/sectionTemplateSchema";
import type { PreviewField, PreviewTemplate } from "@/types/newsection";

/* ==========================================================================
 * TYPES VALIDES POUR LE PREVIEW
 * ========================================================================== */
const VALID_TYPES = [
  "text",
  "textarea",
  "number",
  "image",
  "relation",
  "repeater",
] as const;

type ValidPreviewType = (typeof VALID_TYPES)[number];

function isValidPreviewType(t: string): t is ValidPreviewType {
  return VALID_TYPES.includes(t as ValidPreviewType);
}

/* ==========================================================================
 * NORMALISATION : TemplateFieldType → PreviewField
 * ========================================================================== */

function normalizeFields(fields: TemplateFieldType[]): PreviewField[] {
  return fields.map((f): PreviewField => {
    // 🔒 1) On sécurise le type
    const safeType: ValidPreviewType = isValidPreviewType(f.type)
      ? f.type
      : "text"; // fallback pour éviter les erreurs TS

    // 🔁 2) REPEATER
    if (safeType === "repeater") {
      const subFields = Array.isArray(f.fields) ? f.fields : [];

      return {
        type: "repeater",
        name: f.name,
        label: f.label,
        min: f.min,
        max: f.max,
        fields: normalizeFields(subFields),
      };
    }

    // 🔤 3) FIELDS SIMPLES
    return {
      type: safeType,
      name: f.name,
      label: f.label,
    };
  });
}

/* ==========================================================================
 * TEMPLATE PREVIEW — composant principal
 * ========================================================================== */

export default function TemplatePreview({
  template,
}: {
  template: PreviewTemplate;
}) {
  if (!template)
    return <p className="text-gray-400">Aucun template sélectionné.</p>;

  const normalizedFields = normalizeFields(template.fields);

  return (
    <div className="w-full space-y-4 bg-neutral-900 p-6 rounded-lg">
      {renderFields(normalizedFields)}
    </div>
  );
}

/* ==========================================================================
 * RENDERERS (inchangés)
 * ========================================================================== */

function renderFields(fields: PreviewField[]) {
  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={`${field.type}-${field.name}-${i}`}>{renderField(field)}</div>
      ))}
    </div>
  );
}

function renderField(field: PreviewField) {
  switch (field.type) {
    case "text":
      return <Line />;
    case "textarea":
      return <Paragraph />;
    case "number":
      return <SmallLine />;
    case "image":
      return <ImageBlock />;
    case "relation":
      return <RelationIcon />;
    case "repeater":
      return <RepeaterPreview field={field} />;
    default:
      return <UnknownBlock />;
  }
}

function Line() {
  return <div className="h-4 w-3/4 bg-gray-600 rounded" />;
}
function SmallLine() {
  return <div className="h-3 w-1/4 bg-gray-600 rounded" />;
}
function Paragraph() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-full bg-gray-600 rounded" />
      <div className="h-4 w-4/5 bg-gray-600 rounded" />
      <div className="h-4 w-2/3 bg-gray-600 rounded" />
    </div>
  );
}
function ImageBlock() {
  return <div className="h-24 bg-gray-600 rounded-lg" />;
}
function RelationIcon() {
  return <div className="h-6 w-6 bg-gray-600 rounded-full" />;
}
function UnknownBlock() {
  return <div className="h-6 w-full bg-gray-700 rounded-lg opacity-50" />;
}

function RepeaterPreview({ field }: { field: PreviewField }) {
  if (field.type !== "repeater") return <UnknownBlock />;

  const min = field.min ?? 1;
  const count = Math.min(min, 4);

  return (
    <div
      className={`grid gap-4 ${
        count === 1
          ? "grid-cols-1"
          : count === 2
            ? "grid-cols-2"
            : "grid-cols-3"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`${field.name}-${i}`}
          className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-3"
        >
          {field.fields.map((child, idx) => (
            <div key={`${child.type}-${child.name}-${idx}`}>
              {renderField(child)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import type { FieldType, TemplateType } from "@/types/public";

export default function TemplatePreview({ template }: TemplateType) {
  if (!template) {
    return <p className="text-gray-400">Aucun template sélectionné.</p>;
  }

  // Sécurité : si fields n'est pas valide
  if (!Array.isArray(template.fields)) {
    return (
      <p className="text-red-400 text-sm">
        ⚠️ Ce template ne contient pas de structure "fields".
      </p>
    );
  }

  return (
    <div className="w-full space-y-4 bg-neutral-900 p-6 rounded-lg">
      {renderFields(template.fields)}
    </div>
  );
}

// -----------------------------------------------------
// RENDERER PRINCIPAL (récursif)
// -----------------------------------------------------
function renderFields(fields: FieldType[]) {
  if (!Array.isArray(fields)) return null;

  return (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div key={`${field.type}-${field.field || ""}-${i}`}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}

// -----------------------------------------------------
// RENDER FIELD UNIQUE
// -----------------------------------------------------
function renderField(field: FieldType) {
  if (!field || !field.type) return <UnknownBlock />;

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

// -----------------------------------------------------
// BLOCS VISUELS (mini wireframes)
// -----------------------------------------------------
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

// -----------------------------------------------------
// REPEATER
// -----------------------------------------------------
function RepeaterPreview({ field }: { field: FieldType }) {
  const min = field.min || 1;
  const count = Math.min(min, 4); // limiter à 4 blocs maximum

  if (!Array.isArray(field.fields)) {
    return <UnknownBlock />;
  }

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
      {[...Array(count)].map((_, i) => {
        const itemKey = `${field.field || "repeater"}-${i}-${Date.now()}`;
        return (
          <div
            key={itemKey}
            className="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-700"
          >
            {field.fields?.map((child, childIndex) => (
              <div key={`${child.type}-${child.field || ""}-${childIndex}`}>
                {renderField(child)}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

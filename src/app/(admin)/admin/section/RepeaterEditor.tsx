"use client";

import renderDynamicField from "./renderDynamicField";

export default function RepeaterEditor({
  field,
  value,
  onChange
}: {
  field: any;
  value: any[];
  onChange: (newValue: any[]) => void;
}) {

  const items = value ?? [];

  const addItem = () => {
    // FIX TYPE SCRIPT: objet indexable
    const emptyItem: Record<string, any> = {};

    field.fields.forEach((f: any) => {
      emptyItem[f.name] = f.type === "number" ? 0 : "";
    });

    onChange([...items, emptyItem]);
  };

  const updateItem = (index: number, newVal: any) => {
    const updated = [...items];
    updated[index] = newVal;
    onChange(updated);
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible après sauvegarde.")) return;
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;
    onChange(updated);
  };

  const handleRelationChange = (index: number, selectedItem: any) => {
    // Auto-fill logic: if selectedItem has title_fr/en, fill them if empty or always?
    // User said: "directement ca aurait du m'ajouter le titre"
    // Let's overwrite title_fr/en if they exist in selectedItem content.
    const currentItem = { ...items[index] };
    const content = selectedItem.content || {};

    if (content.title_fr) currentItem.title_fr = content.title_fr;
    if (content.title_en) currentItem.title_en = content.title_en;
    if (content.title) {
      // Fallback if source has only 'title' (like simple sections)
      if (!currentItem.title_fr) currentItem.title_fr = content.title;
    }

    updateItem(index, currentItem);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="text-neutral-200 text-sm">{field.label}</h4>
        <button
          type="button"
          onClick={addItem}
          className="px-2 py-1 rounded bg-neutral-700 text-neutral-100 text-xs hover:bg-neutral-600"
        >
          + Ajouter
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="border border-neutral-700 rounded-lg p-4 flex flex-col gap-3 bg-neutral-800"
        >
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm">Élément {index + 1}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  title="Monter"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  title="Descendre"
                >
                  ↓
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteItem(index)}
              className="text-red-400 text-xs hover:text-red-600"
            >
              Supprimer
            </button>
          </div>

          {field.fields.map((subField: any) => (
            <div key={subField.name}>
              {renderDynamicField({
                field: subField,
                value: item[subField.name],
                onChange: (newVal) =>
                  updateItem(index, { ...item, [subField.name]: newVal }),
                onRelationChange: (selectedItem) => handleRelationChange(index, selectedItem)
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

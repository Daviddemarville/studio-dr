"use client";

import renderDynamicField from "./renderDynamicField";

// --- Fonction PRO pour calculer le TTC ---
function calculateTTC(ht: unknown, tva: unknown): number {
  const prixHT = parseFloat(String(ht).replace(",", "."));
  const tauxTVA = parseFloat(String(tva).replace(",", "."));

  if (!Number.isFinite(prixHT) || !Number.isFinite(tauxTVA)) return 0;

  return parseFloat((prixHT * (1 + tauxTVA / 100)).toFixed(2));
}

export default function RepeaterEditor({
  field,
  value,
  onChange,
}: {
  field: Record<string, unknown>;
  value: Record<string, unknown>[];
  onChange: (newValue: Record<string, unknown>[]) => void;
}) {
  const items = value ?? [];

  const typedFields =
    (field.fields as { name: string; type?: string; label?: string }[]) ?? [];

  const addItem = () => {
    const emptyItem: Record<string, unknown> = {
      _id: crypto.randomUUID(), // 🔥 ID stable pour éviter le warning Biome
    };

    typedFields.forEach((f) => {
      emptyItem[f.name] = f.type === "number" ? 0 : "";
    });

    emptyItem.price_ttc = calculateTTC(emptyItem.price_ht, emptyItem.tva_rate);

    onChange([...items, emptyItem]);
  };

  const updateItem = (index: number, newVal: Record<string, unknown>) => {
    const updated = [...items];

    newVal.price_ttc = calculateTTC(newVal.price_ht, newVal.tva_rate);

    updated[index] = newVal;
    onChange(updated);
  };

  const deleteItem = (index: number) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible après sauvegarde.",
      )
    )
      return;

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

  const handleRelationChange = (
    index: number,
    selectedItem: Record<string, unknown>,
  ) => {
    const currentItem = { ...items[index] };
    const content = (selectedItem.content as Record<string, unknown>) || {};

    if (content.title_fr) currentItem.title_fr = content.title_fr;
    if (content.title_en) currentItem.title_en = content.title_en;

    if (content.title && !currentItem.title_fr) {
      currentItem.title_fr = content.title;
    }

    currentItem.price_ttc = calculateTTC(
      currentItem.price_ht,
      currentItem.tva_rate,
    );

    updateItem(index, currentItem);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="text-neutral-200 text-sm">{field.label as string}</h4>
        <button
          type="button"
          onClick={addItem}
          className="px-2 py-1 rounded bg-neutral-700 text-neutral-100 text-xs hover:bg-neutral-600"
        >
          + Ajouter
        </button>
      </div>

      {items.map((item) => (
        <div
          key={item._id as string} // 🔥 Clé stable → plus aucun warning Biome
          className="border border-neutral-700 rounded-lg p-4 flex flex-col gap-3 bg-neutral-800"
        >
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-sm">Élément</span>

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    moveItem(
                      items.findIndex((i) => i._id === item._id),
                      -1,
                    )
                  }
                  disabled={items.findIndex((i) => i._id === item._id) === 0}
                  className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  title="Monter"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveItem(
                      items.findIndex((i) => i._id === item._id),
                      1,
                    )
                  }
                  disabled={
                    items.findIndex((i) => i._id === item._id) ===
                    items.length - 1
                  }
                  className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  title="Descendre"
                >
                  ↓
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                deleteItem(items.findIndex((i) => i._id === item._id))
              }
              className="text-red-400 text-xs hover:text-red-600"
            >
              Supprimer
            </button>
          </div>

          {typedFields.map((subField) => (
            <div key={subField.name}>
              {renderDynamicField({
                field: subField,
                value: item[subField.name],
                onChange: (newVal) => {
                  const index = items.findIndex((i) => i._id === item._id);
                  updateItem(index, { ...item, [subField.name]: newVal });
                },
                onRelationChange: (selectedItem) =>
                  handleRelationChange(
                    items.findIndex((i) => i._id === item._id),
                    selectedItem,
                  ),
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

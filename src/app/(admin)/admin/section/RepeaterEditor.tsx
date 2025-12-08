"use client";

import { useState } from "react";
import ConfirmModal from "./[slug]/_components/ConfirmModal";
import { deleteSectionItem } from "./[slug]/wrappers/SectionDeleteWrapper";
import renderDynamicField from "./renderDynamicField";

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
  field: {
    name: string;
    label?: string;
    fields: { name: string; type?: string; label?: string }[];
    table_name?: string; // PATCH OK
    section_slug?: string; // PATCH OK
  };
  value: Record<string, unknown>[];
  onChange: (newValue: Record<string, unknown>[]) => void;
}) {
  const items = value ?? [];
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const typedFields =
    (field.fields as { name: string; type?: string; label?: string }[]) ?? [];

  /* -------------------- Ajout -------------------- */
  const addItem = () => {
    const emptyItem: Record<string, unknown> = {
      _id: crypto.randomUUID(),
    };

    typedFields.forEach((f) => {
      emptyItem[f.name] = f.type === "number" ? 0 : "";
    });

    emptyItem.price_ttc = calculateTTC(emptyItem.price_ht, emptyItem.tva_rate);

    onChange([...items, emptyItem]);
  };

  /* -------------------- Update -------------------- */
  const updateItem = (index: number, newVal: Record<string, unknown>) => {
    const previous = items[index];

    const merged: Record<string, unknown> = {
      ...previous,
      ...newVal,
      id: previous.id,
      _id: previous._id,
    };

    merged.price_ttc = calculateTTC(merged.price_ht, merged.tva_rate);

    const updated = [...items];
    updated[index] = merged;

    onChange(updated);
  };

  /* -------------------- Suppression -------------------- */

  const requestDeleteItem = (itemId: string | undefined) => {
    setItemToDelete(itemId ?? null);
    setDeleteOpen(true);
  };

  const confirmDeleteItem = async () => {
    // Si l’élément n’a pas encore d’ID => suppression locale
    if (!itemToDelete) {
      const updated = items.filter((it) => it.id !== undefined);
      onChange(updated);
      setDeleteOpen(false);
      return;
    }

    // Supprimer depuis Supabase
    await deleteSectionItem({
      table: field.table_name || "",
      itemId: itemToDelete,
      sectionSlug: field.section_slug || "",
    });

    const updated = items.filter((item) => item.id !== itemToDelete);
    onChange(updated);

    setDeleteOpen(false);
    setItemToDelete(null);
  };

  /* -------------------- Déplacement -------------------- */
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

  /* -------------------- RENDER -------------------- */

  return (
    <div className="flex flex-col gap-4">
      <ConfirmModal
        isOpen={isDeleteOpen}
        message="Voulez-vous vraiment supprimer cet élément ?"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteItem}
      />

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

      {items.map((item, index) => {
        if (!item._id) item._id = crypto.randomUUID();

        return (
          <div
            key={item._id as string}
            className="border border-neutral-700 rounded-lg p-4 flex flex-col gap-3 bg-neutral-800"
          >
            <div className="flex justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-sm">Élément</span>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="p-1 text-neutral-500 hover:text-neutral-300 disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => requestDeleteItem(item.id as string)}
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
                  onChange: (newVal) =>
                    updateItem(index, { ...item, [subField.name]: newVal }),
                  onRelationChange: (selectedItem) =>
                    handleRelationChange(index, selectedItem),
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

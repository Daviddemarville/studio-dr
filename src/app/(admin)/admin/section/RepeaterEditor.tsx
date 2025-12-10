"use client";

import { useState } from "react";
import type {
  FieldValueType,
  RepeaterItemType,
  TemplateFieldSingle,
} from "@/types/section";
import ConfirmModal from "./[slug]/_components/ConfirmModal";
import { deleteSectionItem } from "./[slug]/wrappers/SectionDeleteWrapper";
import renderDynamicField from "./renderDynamicField";

/* --------------------------------------------------------------------------
 * CALCUL TTC
 * -------------------------------------------------------------------------- */
function calculateTTC(ht: unknown, tva: unknown): number {
  const prixHT = parseFloat(String(ht ?? "").replace(",", "."));
  const tauxTVA = parseFloat(String(tva ?? "").replace(",", "."));

  if (!Number.isFinite(prixHT) || !Number.isFinite(tauxTVA)) return 0;

  return parseFloat((prixHT * (1 + tauxTVA / 100)).toFixed(2));
}

/* --------------------------------------------------------------------------
 * REPEATER EDITOR
 * -------------------------------------------------------------------------- */
export default function RepeaterEditor({
  field,
  value,
  onChange,
}: {
  field: {
    name: string;
    label?: string;
    fields: TemplateFieldSingle[];
    table_name?: string;
    section_slug?: string;
  };
  value: RepeaterItemType[];
  onChange: (newValue: RepeaterItemType[]) => void;
}) {
  const items: RepeaterItemType[] = value ?? [];

  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const typedFields = field.fields ?? [];

  /* -------------------- Ajout -------------------- */
  const addItem = () => {
    const emptyItem: RepeaterItemType = {
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

    const merged: RepeaterItemType = {
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
  const requestDeleteItem = (itemId?: string) => {
    setItemToDelete(itemId ?? null);
    setDeleteOpen(true);
  };

  const confirmDeleteItem = async () => {
    // suppression locale si non présent en DB
    if (!itemToDelete) {
      const updated = items.filter((it) => it.id !== undefined);
      onChange(updated);
      setDeleteOpen(false);
      return;
    }

    // suppression DB
    if (field.table_name && field.section_slug) {
      await deleteSectionItem({
        table: field.table_name,
        itemId: itemToDelete,
        sectionSlug: field.section_slug,
      });
    }

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

  /* -------------------- Relation sélectionnée -------------------- */
  const handleRelationChange = (
    index: number,
    selectedItem: Record<string, unknown>,
  ) => {
    const current = { ...items[index] };
    const content = (selectedItem.content as Record<string, unknown>) ?? {};

    if (content.title_fr) current.title_fr = content.title_fr;
    if (content.title_en) current.title_en = content.title_en;

    if (content.title && !current.title_fr) {
      current.title_fr = content.title;
    }

    current.price_ttc = calculateTTC(current.price_ht, current.tva_rate);

    updateItem(index, current);
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
        <h4 className="text-neutral-200 text-sm">{field.label}</h4>

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
            key={item._id}
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
                  value: item[subField.name] as FieldValueType,
                  onChange: (newVal) =>
                    updateItem(index, { [subField.name]: newVal }),
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

"use client";

import { X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  message,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-white font-semibold">Confirmation</h2>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-neutral-300 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
            onClick={onCancel}
          >
            Annuler
          </button>

          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

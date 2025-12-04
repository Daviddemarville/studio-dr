"use client";

import { toast } from "react-toastify";

export function showConfirmDeleteToast(onConfirm: () => void) {
  toast(
    ({ closeToast }) => (
      <div style={{ padding: "8px 4px" }}>
        <p className="text-sm mb-2">Supprimer définitivement ce message ?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => closeToast()}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Annuler
          </button>

          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    ),
    {
      closeOnClick: false,
      autoClose: false,
      draggable: false,
      pauseOnHover: true,
    },
  );
}

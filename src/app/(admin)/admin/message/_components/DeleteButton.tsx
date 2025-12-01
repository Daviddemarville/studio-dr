"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteMessage } from "./message-actions";
import { toast } from "react-toastify";
import { showConfirmDeleteToast } from "@/app/(admin)/admin/components/ui/ConfirmDeleteToast";

export default function DeleteButton({ id }: { id: string }) {
    const [pending, startTransition] = useTransition();

    const handleDelete = () => {
        showConfirmDeleteToast(() => {
            startTransition(async () => {
                try {
                    await deleteMessage(id);
                    toast.success("Message supprimé 👍");
                } catch (err) {
                    console.error(err);
                    toast.error("Erreur lors de la suppression ❌");
                }
            });
        });
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }}
            className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 transition"
            title="Supprimer"
        >
            {pending ? <span className="opacity-50">...</span> : <Trash2 size={18} />}
        </button>
    );
}

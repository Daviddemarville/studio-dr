"use client";

import { toggleRead } from "./message-actions";
import { useTransition } from "react";
import { Mail, MailOpen } from "lucide-react";

export default function MarkReadButton({
    id,
    current,
}: {
    id: string;
    current: boolean;
}) {
    const [pending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => toggleRead(id, !current))}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
            title={current ? "Marquer non lu" : "Marquer comme lu"}
        >
            {pending ? (
                <span className="opacity-50">...</span>
            ) : current ? (
                <MailOpen size={18} className="text-green-400" />
            ) : (
                <Mail size={18} className="text-blue-400" />
            )}
        </button>
    );
}

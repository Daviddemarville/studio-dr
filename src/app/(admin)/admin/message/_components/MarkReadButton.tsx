"use client";

import { Mail, MailOpen } from "lucide-react";
import { useTransition } from "react";
import type { MessageType } from "@/types/public";
import { toggleRead } from "./message-actions";

export default function MarkReadButton({ id, current }: MessageType) {
  const [pending, startTransition] = useTransition();
  if (!id) {
    console.error("MarkReadButton: missing message id");
    return null;
  }
  const messageId = id;
  const handleClick = () =>
    startTransition(() => toggleRead(messageId, !current));

  return (
    <button
      type="button"
      onClick={handleClick}
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

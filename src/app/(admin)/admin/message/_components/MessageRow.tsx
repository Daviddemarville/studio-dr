"use client";

import type { MessageType } from "@/types/public";
import DeleteButton from "./DeleteButton";
import MarkReadButton from "./MarkReadButton";

export default function MessageRow({
  message,
  onOpen,
}: {
  message: MessageType;
  onOpen: (id: string) => void;
}) {
  const date = new Date(message.created_at || Date.now()).toLocaleString();

  return (
    <tr
      onClick={() => onOpen(message.id)}
      className={`cursor-pointer transition-colors border-b border-white/5 hover:bg-white/10 ${
        message.is_read ? "bg-transparent" : "bg-blue-700/10"
      }`}
    >
      <td className="p-3 font-medium text-white/90">
        {message.firstname} {message.lastname}
      </td>

      <td className="p-3 text-white/60">{message.email}</td>

      <td className="p-3 text-white/80">{message.subject}</td>

      <td className="p-3 max-w-[250px] truncate text-white/70">
        {message.message}
      </td>

      <td className="p-3 text-white/50 whitespace-nowrap">{date}</td>

      {/* Actions : clique limité aux boutons → stopPropagation */}
      <td
        className="p-3 flex justify-end gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <MarkReadButton id={message.id} current={message.is_read ?? false} />
        <DeleteButton id={message.id} />
      </td>
    </tr>
  );
}

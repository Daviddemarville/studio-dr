"use client";

import type { MessageType } from "@/types/public";
import DeleteButton from "./DeleteButton";
import MarkReadButton from "./MarkReadButton";

export default function MessageCard({ message }: { message: MessageType }) {
  const date = new Date(message.created_at).toLocaleString();

  return (
    <div className="space-y-6 text-white">
      {/* ACTIONS */}
      <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
        <div className="text-lg font-semibold">{message.subject}</div>

        <div className="flex gap-3">
          <MarkReadButton id={message.id} current={message.is_read} />
          <DeleteButton id={message.id} />
        </div>
      </div>

      {/* INFOS */}
      <div className="space-y-2">
        <div className="text-white/50 text-xs uppercase">Nom</div>
        <div className="text-white/90">
          {message.firstname} {message.lastname}
        </div>

        <div className="text-white/50 text-xs uppercase mt-4">Email</div>
        <div className="text-blue-300">{message.email}</div>

        <div className="text-white/50 text-xs uppercase mt-4">Date</div>
        <div className="text-white/80">{date}</div>
      </div>

      {/* MESSAGE */}
      <div>
        <div className="text-white/50 text-xs uppercase mb-2">Message</div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-lg whitespace-pre-wrap leading-relaxed text-white/80">
          {message.message}
        </div>
      </div>
    </div>
  );
}

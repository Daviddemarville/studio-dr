"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import type { MessageType } from "@/types/public";
import MessageCard from "./MessageCard";

export default function MessageDrawer({
  open,
  onClose,
  message,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  open: boolean;
  onClose: () => void;
  message: MessageType | null;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        ></button>
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] lg:w-[600px] bg-[#0d0d0d] border-l border-white/10 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={onPrev}
              className={`p-2 rounded-lg ${
                hasPrev
                  ? "hover:bg-white/10 text-white"
                  : "text-white/30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              disabled={!hasNext}
              onClick={onNext}
              className={`p-2 rounded-lg ${
                hasNext
                  ? "hover:bg-white/10 text-white"
                  : "text-white/30 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto h-[calc(100%-56px)] p-4">
          {message ? (
            <MessageCard message={message} />
          ) : (
            <p className="text-white/50">Aucun message...</p>
          )}
        </div>
      </div>
    </>
  );
}

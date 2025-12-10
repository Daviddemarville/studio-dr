"use client";

import Image from "next/image";
import { useState } from "react";
import AvatarEditorModal from "./AvatarEditorModal";

interface AvatarPreviewProps {
  avatarUrl: string | null;
  userId: string;
  onChange: (newUrl: string | null) => void;
}

export default function AvatarPreview({
  avatarUrl,
  userId,
  onChange,
}: AvatarPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* AVATAR DISPLAY */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
    relative
    w-32 h-32 rounded-full overflow-hidden
    border border-neutral-700 
    cursor-pointer
    hover:opacity-80 transition
  "
      >
        <Image
          src={avatarUrl ?? "/default-avatar.png"}
          alt="Avatar"
          width={128}
          height={128}
          className="object-cover w-full h-full"
        />
      </button>

      <button
        type="button"
        className="text-neutral-400 text-sm hover:text-white transition"
        onClick={() => setIsOpen(true)}
      >
        Cliquez pour modifier votre avatar
      </button>

      {/* MODAL */}
      {isOpen && (
        <AvatarEditorModal
          currentAvatarUrl={avatarUrl}
          userId={userId}
          onClose={() => setIsOpen(false)}
          onSaved={(url) => {
            onChange(url);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

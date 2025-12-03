"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import PreviewModal from "./PreviewModal";

export default function PreviewButton({ templateSlug }: { templateSlug: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
            >
                <Eye size={18} />
                Prévisualiser
            </button>

            <PreviewModal
                open={open}
                onClose={() => setOpen(false)}
                templateSlug={templateSlug}
            />
        </>
    );
}

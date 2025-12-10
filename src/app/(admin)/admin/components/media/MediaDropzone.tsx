"use client";

import { type DragEvent, useState } from "react";

interface MediaDropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  height?: number;
}

export default function MediaDropzone({
  onFileSelected,
  accept = "image/*",
  height = 180,
}: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    onFileSelected(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelected(file);
  }

  return (
    <div>
      <button
        type="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
        border border-dashed rounded-md 
        flex flex-col items-center justify-center 
        cursor-pointer transition-all
        ${isDragging ? "bg-neutral-800 border-blue-400" : "bg-neutral-900 border-neutral-700"}
      `}
        style={{ height }}
      >
        <p className="text-neutral-400 text-sm">
          Glissez-déposez un fichier ici
        </p>
        <p className="text-neutral-500 text-xs">ou cliquez pour choisir</p>

        <input
          type="file"
          accept={accept}
          className="hidden"
          id="media-input"
          onChange={handleFileSelect}
        />

        <label
          htmlFor="media-input"
          className="mt-2 px-3 py-1 bg-neutral-700 text-neutral-200 
                 rounded text-xs hover:bg-neutral-600 cursor-pointer"
        >
          Choisir un fichier
        </label>
      </button>{" "}
    </div>
  );
}

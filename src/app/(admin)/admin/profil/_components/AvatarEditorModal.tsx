"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageCropEditor from "../../components/media/ImageCropEditor";
import MediaDropzone from "../../components/media/MediaDropzone";
import { deleteAvatar } from "../actions/delete-avatar";
import { updateAvatarUrl, uploadAvatar } from "../actions/update-avatar";

interface AvatarEditorModalProps {
  currentAvatarUrl: string | null;
  userId: string;
  onClose: () => void;
  onSaved: (newUrl: string | null) => void;
}

export default function AvatarEditorModal({
  currentAvatarUrl,
  userId,
  onClose,
  onSaved,
}: AvatarEditorModalProps) {
  const [step, setStep] = useState<
    "menu" | "dropzone" | "crop" | "crop-existing"
  >("menu");
  const [tempFileUrl, setTempFileUrl] = useState<string | null>(null);

  // ------------------------------------------------------
  // 1) Fichier choisi → aller au crop
  // ------------------------------------------------------
  function handleFileSelected(file: File) {
    setTempFileUrl(URL.createObjectURL(file));
    setStep("crop");
  }

  // ------------------------------------------------------
  // 2) Crop terminé → upload Supabase
  // ------------------------------------------------------
  async function handleCropDone(blob: Blob) {
    const file = new File([blob], `${userId}.jpg`, { type: "image/jpeg" });

    const result = await uploadAvatar(file, userId);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    await updateAvatarUrl(userId, result.url ?? null);

    toast.success("Avatar mis à jour !");
    onSaved(result.url ?? null);
    onClose();
  }

  // ------------------------------------------------------
  // 3) Recadrer l’avatar existant
  // ------------------------------------------------------
  function handleRecrop() {
    if (!currentAvatarUrl) {
      toast.error("Aucun avatar à recadrer.");
      return;
    }

    setTempFileUrl(currentAvatarUrl);
    setStep("crop-existing");
  }

  // ------------------------------------------------------
  // 4) Suppression avatar
  // ------------------------------------------------------
  async function handleDelete() {
    const result = await deleteAvatar(userId);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Avatar supprimé !");
    onSaved(null);
    onClose();
  }

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-[420px] relative">
        {/* Close */}
        <button
          type="button"
          className="absolute top-3 right-3 text-neutral-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* MENU PRINCIPAL */}
        {step === "menu" && (
          <div className="flex flex-col items-center gap-6">
            <Image
              src={currentAvatarUrl ?? "/default-avatar.png"}
              alt="Avatar"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border border-neutral-700"
            />

            <div className="flex flex-col gap-2 w-full text-center">
              <button
                type="button"
                className="bg-blue-600 text-white rounded py-2"
                onClick={() => setStep("dropzone")}
              >
                Modifier la photo
              </button>

              <button
                type="button"
                className="bg-neutral-700 text-white rounded py-2"
                onClick={handleRecrop}
              >
                Cadre
              </button>

              <button
                type="button"
                className="bg-red-600 text-white rounded py-2"
                onClick={handleDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* DROPZONE */}
        {step === "dropzone" && (
          <MediaDropzone onFileSelected={handleFileSelected} />
        )}

        {/* CROP NOUVELLE IMAGE */}
        {step === "crop" && tempFileUrl && (
          <ImageCropEditor
            imageUrl={tempFileUrl}
            cropShape="round"
            aspect={1}
            onCancel={() => setStep("menu")}
            onCropDone={handleCropDone}
          />
        )}

        {/* CROP EXISTANT */}
        {step === "crop-existing" && tempFileUrl && (
          <ImageCropEditor
            imageUrl={tempFileUrl}
            cropShape="round"
            aspect={1}
            onCancel={() => setStep("menu")}
            onCropDone={handleCropDone}
          />
        )}
      </div>
    </div>
  );
}

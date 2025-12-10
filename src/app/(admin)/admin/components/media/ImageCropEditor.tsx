"use client";

import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface ImageCropEditorProps {
  imageUrl: string;
  cropShape?: "rect" | "round";
  aspect?: number;
  onCancel: () => void;
  onCropDone: (blob: Blob) => void;
}

export default function ImageCropEditor({
  imageUrl,
  cropShape = "round",
  aspect = 1,
  onCancel,
  onCropDone,
}: ImageCropEditorProps) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // -----------------------------------------------
  // 1) Validate crop area then process image
  // -----------------------------------------------
  async function getCroppedImg() {
    if (!croppedAreaPixels) {
      throw new Error("Zone de crop non définie");
    }

    const blob = await cropImage(imageUrl, croppedAreaPixels, cropShape);
    onCropDone(blob);
  }

  // -----------------------------------------------
  // 2) Crop engine
  // -----------------------------------------------
  async function cropImage(
    url: string,
    cropPixels: Area,
    shape: "rect" | "round",
  ): Promise<Blob> {
    const image = await new Promise<HTMLImageElement>((resolve) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.src = url;
      i.onload = () => resolve(i);
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Impossible d'obtenir le contexte du canvas");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    if (shape === "round") {
      ctx.beginPath();
      ctx.arc(
        cropPixels.width / 2,
        cropPixels.height / 2,
        cropPixels.width / 2,
        0,
        Math.PI * 2,
      );
      ctx.closePath();
      ctx.clip();
    }

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height,
    );

    return new Promise((resolve) =>
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error("Échec de la génération du blob");
          resolve(blob);
        },
        "image/png",
        1,
      ),
    );
  }

  // -----------------------------------------------
  // Render
  // -----------------------------------------------
  return (
    <div
      className="
        fixed inset-0 z-40 
        bg-black bg-opacity-60 
        flex items-center justify-center
      "
    >
      <div className="bg-neutral-900 p-6 rounded-lg w-[420px]">
        <h3 className="text-white text-lg mb-4">Recadrer l'image</h3>

        {/* Cropper */}
        <div className="relative w-full h-[300px] bg-black rounded overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </div>

        {/* Zoom slider */}
        <div className="mt-4">
          <label htmlFor="zoom" className="text-sm text-neutral-300">
            Zoom
          </label>
          <input
            id="zoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={getCroppedImg}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

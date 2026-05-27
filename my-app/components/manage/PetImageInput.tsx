"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, Check, ImageIcon, X } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface PetImageInputProps {
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  onDelete?: () => void;
}

async function cropToFile(imageSrc: string, cropPx: Area): Promise<File> {
  const img = new Image();
  img.src = imageSrc;
  await new Promise((res) => { img.onload = res; });
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, cropPx.x, cropPx.y, cropPx.width, cropPx.height, 0, 0, 800, 800);
  return new Promise((res) =>
    canvas.toBlob(
      (blob) => res(new File([blob!], "photo.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.9
    )
  );
}

export default function PetImageInput({ currentImageUrl, onChange, onDelete }: PetImageInputProps) {
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPx, setCropPx] = useState<Area | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setRawSrc(URL.createObjectURL(f));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    e.target.value = "";
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCropPx(pixels), []);

  async function handleConfirm() {
    if (!rawSrc || !cropPx) return;
    const file = await cropToFile(rawSrc, cropPx);
    setPreview(URL.createObjectURL(file));
    setRawSrc(null);
    onChange(file);
  }

  const displayImage = preview ?? currentImageUrl;

  if (rawSrc) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="relative flex-1">
          <Cropper
            image={rawSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="bg-black/90 px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-xs">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-white"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-medium text-sm">
              <Check size={16} />
              Use Photo
            </button>
            <button
              type="button"
              onClick={() => setRawSrc(null)}
              className="flex-1 flex items-center justify-center gap-2 border border-white/40 text-white py-2.5 rounded-lg text-sm">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {displayImage && (
        <div className="relative mb-2">
          <img src={displayImage} alt="Preview" className="w-full h-64 object-cover rounded" />
          {confirmingDelete ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 rounded">
              <p className="text-white text-sm font-medium">Remove this photo?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setConfirmingDelete(false); onDelete?.(); }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium">
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (preview) {
                  setPreview(null);
                  onChange(null);
                } else {
                  setConfirmingDelete(true);
                }
              }}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5"
              aria-label="Remove photo">
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded bg-white hover:bg-gray-50">
          <Camera size={15} />
          Camera
        </button>
        <button
          type="button"
          onClick={() => libraryRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded bg-white hover:bg-gray-50">
          <ImageIcon size={15} />
          Library
        </button>
      </div>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <input ref={libraryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

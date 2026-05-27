"use client";

import { useState, useCallback, useRef } from "react";
import { Star, Trash2, Camera, ImageIcon, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { getPetImages, uploadPetImage, setPrimaryImage, deleteImageById } from "@/app/admin/manage/cats/actions";
import { PetImageData } from "@/types/types";

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

export default function PetImageManager({ petId }: { petId: string }) {
  const [images, setImages] = useState<PetImageData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPx, setCropPx] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const imgs = await getPetImages(petId);
    setImages(imgs);
    setLoading(false);
  }

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

  async function handleConfirmCrop() {
    if (!rawSrc || !cropPx) return;
    setUploading(true);
    const file = await cropToFile(rawSrc, cropPx);
    setRawSrc(null);
    const result = await uploadPetImage(petId, file);
    if (result.error) {
      setError(result.error);
    } else {
      await load();
    }
    setUploading(false);
  }

  async function handleSetPrimary(imageId: string) {
    setError(null);
    const result = await setPrimaryImage(petId, imageId);
    if (result.error) setError(result.error);
    else await load();
  }

  async function handleDelete(imageId: string, storagePath: string) {
    setError(null);
    const result = await deleteImageById(petId, imageId, storagePath);
    if (result.error) setError(result.error);
    else await load();
  }

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
            <input type="range" min={1} max={3} step={0.01} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-white" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleConfirmCrop} disabled={uploading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-lg font-medium text-sm disabled:opacity-50">
              <Check size={16} />
              {uploading ? "Uploading…" : "Use Photo"}
            </button>
            <button type="button" onClick={() => setRawSrc(null)}
              className="flex-1 flex items-center justify-center gap-2 border border-white/40 text-white py-2.5 rounded-lg text-sm">
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (images === null) {
    return (
      <button type="button" onClick={load} disabled={loading}
        className="w-full border border-gray-200 text-gray-500 px-3 py-2 rounded text-sm hover:bg-gray-50 disabled:opacity-50">
        {loading ? "Loading…" : "Manage Images"}
      </button>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Images ({images.length})
        </span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => cameraRef.current?.click()}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <Camera size={13} /> Camera
          </button>
          <button type="button" onClick={() => libraryRef.current?.click()}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <ImageIcon size={13} /> Library
          </button>
        </div>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        <input ref={libraryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      {images.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">No images yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.url}
                alt=""
                className={`w-full aspect-square object-cover rounded border-2 ${img.is_primary ? "border-blue-400" : "border-transparent"}`}
              />
              {img.is_primary && (
                <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-tight">
                  Primary
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-end justify-center gap-1 pb-1.5">
                {!img.is_primary && (
                  <button type="button"
                    onClick={() => handleSetPrimary(img.id)}
                    title="Set as primary"
                    className="bg-white/90 hover:bg-white text-yellow-500 p-1 rounded">
                    <Star size={13} />
                  </button>
                )}
                <button type="button"
                  onClick={() => handleDelete(img.id, img.storage_path)}
                  title="Delete image"
                  className="bg-white/90 hover:bg-white text-red-500 p-1 rounded">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setImages(null)}
        className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 text-center">
        Hide Images
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Pet } from "@/types/types";

export default function CatCard({ pet }: { pet: Pet }) {
  const images = pet.image_urls && pet.image_urls.length > 0
    ? pet.image_urls
    : pet.primary_image_url
    ? [pet.primary_image_url]
    : [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((i) => (i + 1) % images.length);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-72 bg-gray-100">
        {images.length > 0 ? (
          <img
            key={currentIdx}
            src={images[currentIdx]}
            alt={pet.name}
            className={`w-full h-72 object-cover transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="w-full h-72 flex items-center justify-center text-5xl text-gray-300">🐾</div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === currentIdx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold">{pet.name}</h2>
          {pet.status === "pending adoption" && (
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
              Pending Adoption
            </span>
          )}
        </div>
        {pet.breed && <p className="text-gray-600 mb-1">{pet.breed}</p>}
        <p className="text-gray-500 text-sm capitalize">{pet.sex}{pet.age ? ` · ${pet.age}` : ""}</p>
        {pet.description && (
          <p className="text-gray-700 mt-2 text-sm line-clamp-3">{pet.description}</p>
        )}
      </div>
    </div>
  );
}

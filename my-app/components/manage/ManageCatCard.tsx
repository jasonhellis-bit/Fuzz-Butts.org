"use client";

import { Cat } from "@/types/types";
import { useState } from "react";

export default function ManageCatCard({ cat }: { cat: Cat }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={cat.name}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={cat.breed}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            value={cat.age}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            value={cat.description}
            className="border p-2 mb-2 w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
            Save
          </button>
        </div>
      ) : (
        <div>
          <img
            src={cat.imageUrl}
            alt={cat.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{cat.name}</h2>
          <p className="text-gray-600 mb-2">{cat.breed}</p>
          <p className="text-gray-600 mb-4">{cat.age} years old</p>
          <p className="text-gray-700 mb-4">{cat.description}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

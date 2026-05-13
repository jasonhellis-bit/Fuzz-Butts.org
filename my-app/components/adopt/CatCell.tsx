import { Cat } from "@/types/types";

export default function CatCell({ cat }: { cat: Cat }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={cat.imageUrl}
        alt={cat.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-bold mb-2">{cat.name}</h2>
      <p className="text-gray-600 mb-2">{cat.breed}</p>
      <p className="text-gray-600 mb-4">{cat.age} years old</p>
      <p className="text-gray-700 mb-4">{cat.description}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Adopt
      </button>
    </div>
  );
}

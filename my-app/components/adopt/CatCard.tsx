import { Pet } from "@/types/types";

export default function CatCard({ pet }: { pet: Pet }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {pet.primary_image_url ? (
        <img src={pet.primary_image_url} alt={pet.name} className="w-full h-72 object-cover" />
      ) : (
        <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-5xl text-gray-300">🐾</div>
      )}
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
        <p className="text-gray-500 text-sm mb-3 capitalize">{pet.sex}</p>
        {pet.description && (
          <p className="text-gray-700 mb-4 text-sm line-clamp-3">{pet.description}</p>
        )}
      </div>
    </div>
  );
}

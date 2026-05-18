"use client";

interface AddCatCardProps {
  onAdd?: () => void;
}

export default function AddCatCard({ onAdd }: AddCatCardProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="h-full w-full rounded-lg border border-dashed border-gray-300 bg-white p-4 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Add a cat">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-6xl font-bold text-blue-600">
          +
        </div>
        <span className="text-lg font-semibold text-gray-700">Add a cat</span>
      </div>
    </button>
  );
}

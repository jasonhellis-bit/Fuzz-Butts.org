"use client";

import { sampleCats } from "@/components/helpers/tempData";
import AddCatCard from "@/components/manage/AddCatCard";
import ManageCatCard from "@/components/manage/ManageCatCard";

export default function ManageCatsPage() {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold mb-8">Cat Management</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Here you can manage cat profiles, view cat details, and update cat
        information.
      </p>
      <div className="grid w-full max-w-7xl gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AddCatCard onAdd={() => console.log("Add cat clicked")} />
        {sampleCats.map((cat) => (
          <ManageCatCard key={cat.name} cat={cat} />
        ))}
      </div>
    </div>
  );
}

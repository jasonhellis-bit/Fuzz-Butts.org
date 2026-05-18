import CatCard from "@/components/adopt/CatCard";
import { sampleCats } from "@/components/helpers/tempData";

export default function AdoptPage() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-8 py-16">
      <h1 className="text-4xl font-bold">Adopt a Cat</h1>
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleCats.map((cat) => (
            <CatCard key={cat.name} cat={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}

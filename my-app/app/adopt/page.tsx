import CatCell from "@/components/adopt/CatCell";

const sampleCats = [
  {
    name: "Ali",
    breed: "Siamese",
    age: 2,
    description: "A playful and affectionate cat.",
    imageUrl: "/cats/ali.jpg",
  },
  {
    name: "Eggs",
    breed: "Domestic Shorthair",
    age: 3,
    description: "Loves to cuddle and is great with kids.",
    imageUrl: "/cats/eggs.jpg",
  },
  {
    name: "Luna",
    breed: "Maine Coon",
    age: 1,
    description: "A gentle giant who enjoys lounging and being petted.",
    imageUrl: "/cats/luna-1.jpg",
  },
  {
    name: "Ham",
    breed: "Bengal",
    age: 4,
    description: "Energetic and loves to play with toys.",
    imageUrl: "/cats/ham.jpg",
  },
  {
    name: "Kiki",
    breed: "Persian",
    age: 5,
    description: "Calm and loves to be pampered.",
    imageUrl: "/cats/kiki.jpg",
  },
  {
    name: "Ozzie",
    breed: "Ragdoll",
    age: 3,
    description: "A sweet cat who loves to be held and cuddled.",
    imageUrl: "/cats/ozzie.jpg",
  },
];

export default function AdoptPage() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-8 py-16">
      <h1 className="text-4xl font-bold">Adopt a Cat</h1>
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleCats.map((cat) => (
            <CatCell key={cat.name} cat={cat} />
          ))}
        </div>
      </div>
    </div>
  );
}

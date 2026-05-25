import FeaturedAdoption from "@/components/home/FeaturedAdoption";
import MissionStatement from "@/components/home/MissionStatement";

export default function Home() {
  return (
    <div className="bg-white px-6 py-12 sm:px-16">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch">
        <MissionStatement />
        <FeaturedAdoption />
      </div>
    </div>
  );
}

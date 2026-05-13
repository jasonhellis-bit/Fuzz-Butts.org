import FeaturedAdoption from "@/components/home/FeaturedAdoption";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <FeaturedAdoption />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

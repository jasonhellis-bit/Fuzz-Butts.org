export default function About() {
  // comment
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
                <div className="w-full sm:w-1/3">
                  <img
                    src="/fuzz_butts_founder.jpg"
                    alt="Fuzz Butts founder"
                    className="h-auto w-full rounded-3xl object-cover shadow-xl"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h1 className="text-4xl font-bold mb-4">
                    Amelia Duncan, Founder
                  </h1>
                  <p className="text-lg text-gray-700 mb-6">
                    My journey into cat rescuing started with one scared little
                    stray cat that I saw at a fast food restaurant. I would stop
                    there to get food frequently on my way to work. I would see
                    her there almost every time I would stop. I decided to trap
                    her one night and once she was trapped I took her home.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    What began as helping one cat quickly turned into helping
                    many more. I started noticing how many homeless cats were
                    living outside, especially kittens born in unsafe
                    conditions. I learned about the overwhelming number of
                    animals in shelters and how easily cats can be overlooked.
                    The more I learned, the harder it became to turn away.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Cat rescuing has taught me patience, compassion, and
                    resilience. Many of the cats I’ve worked with arrived
                    scared, sick, injured, or completely unsocialized. Some had
                    never experienced kindness from humans before. Watching them
                    slowly learn to trust again is one of the most rewarding
                    experiences imaginable. There is nothing quite like seeing a
                    frightened cat transform into a confident, loving companion
                    once they realize they are safe.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Over time, my passion for rescue grew into something much
                    bigger than I ever expected. Rescue work is not always easy.
                    It can be emotionally exhausting, heartbreaking, and
                    financially challenging. There are moments of loss and
                    situations you never forget. But there are also incredible
                    victories — the successful adoptions, the sick kittens who
                    survive, and the families who discover the joy of giving a
                    rescue cat a second chance.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    That passion ultimately inspired the creation of Fuzz Butts,
                    a nonprofit dedicated to rescuing cats and helping them find
                    safe, loving homes. Through rescue efforts, fostering,
                    community support, and education, the mission has always
                    remained the same: to give vulnerable cats the care,
                    dignity, and love they deserve.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    For me, cat rescuing is more than a hobby or volunteer
                    effort. It is a lifelong commitment and a true calling.
                    Every cat has a story, and every rescue reminds me why this
                    work matters. Even the smallest act of kindness can
                    completely change an animal’s life. In return, these cats
                    have changed mine in ways I never could have imagined.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

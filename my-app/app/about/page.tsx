import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the people behind Fuzz Butts, a 501(c)(3) nonprofit cat rescue dedicated to rescuing cats and finding them safe, loving homes.",
};

export default function About() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <div className="flex items-center gap-6 mb-10">
                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Find us on social media
                </span>
                <a
                  href="https://www.tiktok.com/@fuzz.butts?_r=1&_t=ZT-975B3lKKJeI"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10 text-black hover:opacity-75 transition-opacity">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/fuzzbutts?utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-10 w-10 hover:opacity-75 transition-opacity"
                    style={{ color: "#E1306C" }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>

              <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
                <div className="w-full sm:w-1/6">
                  <img
                    src="/fuzz_butts_founder.jpg"
                    alt="Fuzz Butts founder"
                    className="h-auto w-full rounded-3xl object-cover shadow-xl"
                  />
                </div>
                <div className="w-full sm:w-5/6">
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

              <hr className="my-12 border-gray-200" />

              <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
                <div className="w-full sm:w-1/6">
                  <img
                    src="/fuzz_butts_cto.jpg"
                    alt="Fuzz Butts Chief Technology Officer"
                    className="h-auto w-full rounded-3xl object-cover shadow-xl"
                  />
                </div>
                <div className="w-full sm:w-5/6">
                  <h1 className="text-4xl font-bold mb-4">
                    Jason Ellis, Chief Technology Officer
                  </h1>
                  <p className="text-lg text-gray-700 mb-6">
                    There's a particular kind of magic in loving cats. It lives
                    in the moment a purring body finds its way into your lap
                    uninvited, as if you were always just a warm place waiting
                    to be chosen. Cats don't love easily, and that's exactly
                    what makes it mean so much when they do.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    A cat's slow blink is a whole language. A headbutt against
                    your shin, a tiny offering. The way they curl into
                    impossible circles and sleep like the world is perfectly
                    safe, because you're in it.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    To love cats is to appreciate the small things: the
                    ridiculous chirp at a bird through the window, the
                    theatrical flop onto the floor demanding attention, the 3am
                    zoom across the apartment for reasons only they understand.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    They are soft chaos wrapped in fur, and somehow they make
                    everywhere feel like home. That love runs so deep that it
                    inspired more than just admiration from afar. It inspired
                    action. I built this website to support Fuzz Butts and its
                    founder, Amelia, because cats deserve a space made with the
                    same care and devotion they quietly inspire in us every
                    single day.
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

import { ArrowRight, PawPrint } from "lucide-react";
import Button from "@/components/ui/Button";

const FUZZ_LOUNGE_URL = "https://fuzzlounge.com";

export default function CafeAnnouncement() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-10">
      <div className="flex flex-col items-center border-b border-gold/70 py-12 text-center">
        <div className="flex items-center gap-6" aria-hidden="true">
          <span className="h-px w-24 bg-gold/80 sm:w-32" />
          <PawPrint className="h-8 w-8 fill-gold text-gold" />
          <span className="h-px w-24 bg-gold/80 sm:w-32" />
        </div>
        <h2 className="mt-4 text-3xl font-bold uppercase text-brand sm:text-4xl">
          A Cat Café Is in the Works!
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-muted">
          We&rsquo;re building Fuzz Lounge, a cat café where visitors can meet Fuzz Butts cats who are
          ready for adoption. More chances to meet our cats means more loving homes&mdash;and more room
          for us to rescue cats who need help.
        </p>
        <Button href={FUZZ_LOUNGE_URL} target="_blank" rel="noopener noreferrer" className="mt-6">
          Visit Fuzz Lounge
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

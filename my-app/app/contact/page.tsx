import type { Metadata } from "next";
import { Mail } from "lucide-react";
import IconRing from "@/components/ui/IconRing";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Fuzz Butts Cat Rescue with questions about adoption, fostering, or donations.",
};

export default function Contact() {
  return (
    <div className="min-h-screen w-full">
      <main className="flex min-h-screen w-full flex-col items-center justify-start px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <SectionHeading as="h1" size="lg" className="mb-4">Contact Us</SectionHeading>
              <p className="text-lg leading-8 text-ink mb-8 max-w-3xl">
                If you have any questions or inquiries, please feel free to
                reach out to us. We are here to help and would love to hear from
                you!
              </p>
              <div className="inline-flex items-center gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm shadow-ink/5">
                <IconRing>
                  <Mail aria-hidden="true" />
                </IconRing>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink-muted">Email us</p>
                  <a
                    href="mailto:fuzzbuttinc@gmail.com"
                    className="text-lg font-semibold text-brand hover:underline">
                    fuzzbuttinc@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

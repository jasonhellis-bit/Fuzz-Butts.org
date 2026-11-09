import type { Metadata } from "next";
import { Allura, Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

const description =
  "Fuzz Butts is a 501(c)(3) nonprofit cat rescue dedicated to rescuing cats and helping them find safe, loving homes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Adopt a Cat`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  keywords: [
    "cat rescue",
    "cat adoption",
    "adopt a cat",
    "nonprofit animal rescue",
    "Fuzz Butts",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Adopt a Cat`,
    description,
    url: SITE_URL,
    images: [{ url: "/fuzz_butts_banner_large.jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Adopt a Cat`,
    description,
    images: ["/fuzz_butts_banner_large.jpeg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  url: SITE_URL,
  description,
  logo: `${SITE_URL}/fuzz_butts_banner.jpeg`,
  email: "fuzzbuttinc@gmail.com",
  sameAs: [
    "https://www.tiktok.com/@fuzz.butts",
    "https://www.instagram.com/fuzzbutts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${playfair.variable} ${allura.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}

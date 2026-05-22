import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import FuzzButtsBanner from "@/components/navigation/FuzzButtsBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Fuzz Butts Cat Rescue",
  description:
    "A nonprofit dedicated to rescuing cats and helping them find safe, loving homes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navigation />
        <FuzzButtsBanner />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-100 border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Fuzz Butts. All rights reserved.</p>
          <p>Fuzz Butts is a registered 501(c)(3) charitable organization.</p>
        </footer>
      </body>
    </html>
  );
}

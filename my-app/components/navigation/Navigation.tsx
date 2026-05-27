"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [navColor, setNavColor] = useState("#2563eb");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Adopt", href: "/adopt" },
    { label: "Donate", href: "/donate" },
    { label: "Contact", href: "/contact" },
  ];

  const getDarkerColor = (hex: string) => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - 30);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - 30);
    const b = Math.max(0, (num & 0x0000ff) - 30);
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  };

  const getLighterColor = (hex: string) => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + 50);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + 50);
    const b = Math.min(255, (num & 0x0000ff) + 50);
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  };

  return (
    <nav
      style={{ backgroundColor: navColor, color: fontColor }}
      className="shadow-lg">
      <div className="relative max-w-7xl mx-auto px-4 h-16">
        {/* Logo + color picker */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10" ref={panelRef}>
          <div className="relative group">
            <button
              onClick={() => setPanelOpen((o) => !o)}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-base font-bold leading-none transition-colors opacity-60 hover:opacity-100"
              style={{ borderColor: fontColor, color: fontColor, backgroundColor: "transparent" }}>
              {panelOpen ? "×" : "+"}
            </button>
            <div className="absolute left-0 top-full mt-2 z-50 hidden group-hover:block w-56 rounded-md bg-black/80 px-3 py-2 text-xs text-white shadow-lg">
              Pre Production tool for experimenting with different banner colors
            </div>
          </div>
          <span
            className="text-2xl sm:text-4xl select-none"
            style={{ fontFamily: "var(--font-pacifico)", color: fontColor, textShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}>
            Fuzz Butts
          </span>
          {panelOpen && (
            <div
              className="absolute left-0 top-full mt-2 z-50 rounded-lg shadow-xl border border-white/20 bg-black/70 backdrop-blur-sm px-4 py-3"
              style={{ minWidth: 200 }}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <label className="text-xs mb-1 text-white/80">BG</label>
                  <input
                    type="color"
                    id="nav-color"
                    value={navColor}
                    onChange={(e) => setNavColor(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="nav-color"
                    className="w-20 h-10 rounded cursor-pointer border-2 flex items-center justify-center text-xs font-mono"
                    style={{
                      backgroundColor: navColor,
                      borderColor: fontColor,
                      color: fontColor,
                    }}
                    title="Pick background color">
                    {navColor}
                  </label>
                </div>
                <div className="flex flex-col items-center">
                  <label className="text-xs mb-1 text-white/80">Font</label>
                  <input
                    type="color"
                    id="font-color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="font-color"
                    className="w-20 h-10 rounded cursor-pointer border-2 flex items-center justify-center text-xs font-mono"
                    style={{
                      backgroundColor: fontColor,
                      borderColor: navColor,
                      color: navColor,
                    }}
                    title="Pick font color">
                    {fontColor}
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop nav items */}
        <div className="hidden md:flex items-center justify-center h-full">
          <div className="flex space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={
                    isActive
                      ? { backgroundColor: getDarkerColor(navColor), color: fontColor }
                      : { backgroundColor: "transparent", color: fontColor, transition: "background-color 0.2s" }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = getLighterColor(navColor);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                    }
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop donate button */}
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-3 py-2">
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: fontColor }}>
              Donate
            </span>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=P2HJJE69NEKRG"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center">
              <img
                src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                alt="PayPal"
                className="h-6 w-auto"
              />
              <span className="sr-only">PayPal</span>
            </a>
          </div>
        </div>

        {/* Mobile hamburger button */}
        <div className="flex md:hidden items-center justify-end h-full">
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-2 rounded-md"
            style={{ color: fontColor }}
            aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: navColor }}
          className="md:hidden border-t border-white/20 px-4 pb-4">
          <div className="flex flex-col space-y-1 pt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-md font-medium"
                  style={{
                    backgroundColor: isActive ? getDarkerColor(navColor) : "transparent",
                    color: fontColor,
                  }}>
                  {item.label}
                </Link>
              );
            })}
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=P2HJJE69NEKRG"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-4 py-2"
              style={{ color: fontColor }}>
              <span className="text-sm font-medium">Donate via PayPal</span>
              <img
                src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                alt="PayPal"
                className="h-5 w-auto"
              />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

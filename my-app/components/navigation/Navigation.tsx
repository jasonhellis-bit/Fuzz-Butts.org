"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [navColor, setNavColor] = useState("#2563eb");
  const [fontColor, setFontColor] = useState("#ffffff");

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
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-3 rounded-md border border-white/40 bg-white/10 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1" style={{ color: fontColor }}>
                  BG
                </label>
                <input
                  type="color"
                  id="nav-color"
                  value={navColor}
                  onChange={(e) => setNavColor(e.target.value)}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="nav-color"
                  className="w-20 h-12 rounded cursor-pointer border-2 flex items-center justify-center text-sm font-mono"
                  style={{
                    backgroundColor: navColor,
                    borderColor: fontColor,
                    color: fontColor,
                  }}
                  title="Pick background color (temporary for trying different color schemes)">
                  {navColor}
                </label>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs mb-1" style={{ color: fontColor }}>
                  Font
                </label>
                <input
                  type="color"
                  id="font-color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="font-color"
                  className="w-20 h-12 rounded cursor-pointer border-2 flex items-center justify-center text-sm font-mono"
                  style={{
                    backgroundColor: navColor,
                    borderColor: fontColor,
                    color: fontColor,
                  }}
                  title="Pick font color (temporary for trying different color schemes)">
                  {fontColor}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-3 py-2">
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: fontColor }}>
              Donate
            </span>
            <a
              href="https://www.paypal.com"
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
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md font-medium transition-colors`}
                  style={
                    isActive
                      ? {
                          backgroundColor: getDarkerColor(navColor),
                          color: fontColor,
                        }
                      : {
                          backgroundColor: "transparent",
                          color: fontColor,
                          transition: "background-color 0.2s",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (
                        e.currentTarget as HTMLAnchorElement
                      ).style.backgroundColor = getLighterColor(navColor);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (
                        e.currentTarget as HTMLAnchorElement
                      ).style.backgroundColor = "transparent";
                    }
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

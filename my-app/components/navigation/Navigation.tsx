"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const navColor = "#2563eb";
  const fontColor = "#ffffff";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

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
      className="sticky top-0 z-50 shadow-lg">
      <div className="relative max-w-7xl mx-auto px-4 h-16">
        {/* Logo */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center z-10 pl-4 md:pl-0">
          <span
            className="text-2xl sm:text-4xl select-none"
            style={{
              fontFamily: "var(--font-pacifico)",
              color: fontColor,
              textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
            }}>
            Fuzz Butts
          </span>
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
            {isLoggedIn && (
              <Link
                href="/admin/manage/home"
                className="px-4 py-2 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: pathname.startsWith("/admin")
                    ? getDarkerColor(navColor)
                    : "transparent",
                  color: fontColor,
                }}
                onMouseEnter={(e) => {
                  if (!pathname.startsWith("/admin")) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = getLighterColor(navColor);
                  }
                }}
                onMouseLeave={(e) => {
                  if (!pathname.startsWith("/admin")) {
                    (
                      e.currentTarget as HTMLAnchorElement
                    ).style.backgroundColor = "transparent";
                  }
                }}>
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-3">
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
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors"
              style={{ color: fontColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  getLighterColor(navColor);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}>
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors"
              style={{ color: fontColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  getLighterColor(navColor);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "transparent";
              }}>
              <LogIn size={18} />
              <span className="text-sm">Login</span>
            </Link>
          )}
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
                    backgroundColor: isActive
                      ? getDarkerColor(navColor)
                      : "transparent",
                    color: fontColor,
                  }}>
                  {item.label}
                </Link>
              );
            })}
            {isLoggedIn && (
              <Link
                href="/admin/manage/home"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-md font-medium"
                style={{
                  backgroundColor: pathname.startsWith("/admin")
                    ? getDarkerColor(navColor)
                    : "transparent",
                  color: fontColor,
                }}>
                Admin
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-md font-medium"
                style={{ color: fontColor }}>
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-md font-medium"
                style={{ color: fontColor }}>
                <LogIn size={18} />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
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

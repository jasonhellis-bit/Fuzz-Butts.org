"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
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
    { label: "About", href: "/about", active: pathname === "/about" },
    { label: "Adopt", href: "/adopt", active: pathname.startsWith("/adopt") },
    {
      label: "How It Works",
      href: "/how-it-works",
      active: pathname === "/how-it-works",
    },
    { label: "Contact", href: "/contact", active: pathname === "/contact" },
    ...(isLoggedIn
      ? [
          {
            label: "Admin",
            href: "/admin/manage/home",
            active: pathname.startsWith("/admin"),
          },
        ]
      : []),
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-parchment shadow-sm shadow-ink/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo onClick={closeMenu} />

        {/* Desktop nav items */}
        <div className="hidden flex-1 items-center justify-end gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`relative px-3 py-2 text-[15px] font-medium transition-colors hover:text-brand ${
                item.active
                  ? "text-brand after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-gold"
                  : "text-ink"
              }`}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-4 lg:flex">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-brand">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-brand">
              <LogIn size={16} /> Login
            </Link>
          )}
          <Button href="/donate" size="sm" className="px-5 py-2">
            Donate <Heart size={16} aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="rounded-md p-2 text-brand lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-parchment px-4 pb-5 lg:hidden">
          <div className="flex flex-col pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={item.active ? "page" : undefined}
                className={`border-b border-line/60 px-2 py-3 font-medium ${
                  item.active ? "text-brand" : "text-ink"
                }`}>
                {item.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center gap-2 px-2 py-3 text-sm text-ink-muted">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center gap-2 px-2 py-3 text-sm text-ink-muted">
                <LogIn size={16} /> Login
              </Link>
            )}
            <Button href="/donate" onClick={closeMenu} className="mt-2 w-full">
              Donate <Heart size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Illustrated logo on a tab that hangs below the nav bar. The link reserves
// the tab's width in the row; the tab itself is absolutely positioned so it
// can overflow the bar's fixed height. The tab and nav use bg-parchment, which
// matches the PNG's opaque beige so the image edges disappear.
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Fuzz Butts Cat Rescue — Home"
      className="relative w-[154px] shrink-0 self-stretch lg:w-[289px]">
      <span className="absolute left-0 top-0 z-10 rounded-b-2xl bg-parchment px-3 pb-2 pt-2">
        <Image
          src="/fuzz_butts_logo_cropped.png"
          alt="Fuzz Butts Cat Rescue"
          width={530}
          height={327}
          priority
          className="h-auto w-[130px] lg:w-[265px]"
        />
      </span>
    </Link>
  );
}

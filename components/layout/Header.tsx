"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { LocaleSwitch } from "./LocaleSwitch";
import { useCart, cartCount } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { CartIcon, CloseIcon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

export function Header() {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокируем скролл под открытым мобильным меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const count = mounted ? cartCount(lines) : 0;

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-soft backdrop-blur-md bg-cream/92" : "bg-cream"
      }`}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label={dict.nav.catalog}>
            {navLinks.map((l) => (
              <a
                key={dict.nav[l.key]}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-[14px] text-green-900/85 transition-colors hover:text-green-700"
              >
                {dict.nav[l.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitch className="hidden sm:flex" />

            <Button as="a" href="#order" size="sm" className="hidden sm:inline-flex sm:h-11 sm:px-7">
              {dict.header.order}
            </Button>

            <button
              type="button"
              onClick={openCart}
              className="relative grid h-11 w-11 place-items-center rounded-full text-green-900 transition-colors hover:bg-green-700/8"
              aria-label={count ? `${dict.header.cartWithCount} ${count}` : dict.header.cartEmpty}
            >
              <CartIcon className="w-[22px]" />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-green-700 px-1 text-[11px] font-semibold text-cream">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-green-900 transition-colors hover:bg-green-700/8 lg:hidden"
              aria-label={dict.header.openMenu}
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-3/4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
          menuOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-green-900/35 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-cream px-6 py-6 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label={dict.nav.catalog}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full text-green-900 hover:bg-green-700/8"
              aria-label={dict.header.closeMenu}
            >
              <CloseIcon className="w-5" />
            </button>
          </div>

          <div className="mt-9 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={dict.nav[l.key]}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="border-b border-green-200/50 py-3.5 text-[17px] text-green-900"
              >
                {dict.nav[l.key]}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <Button
              as="a"
              href="#order"
              size="lg"
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              {dict.header.order}
            </Button>

            <div className="flex items-center justify-between gap-3 border-t border-green-200/50 pt-4">
              <span className="text-[13px] text-muted">{dict.header.switchLanguage}</span>
              <LocaleSwitch />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { HeaderData } from "@/lib/header";
import { LocaleSwitch } from "./LocaleSwitch";
import { useCart, cartCount } from "@/lib/cart";
import { CartIcon, CloseIcon } from "@/components/ui/Icons";
import { Container } from "@/components/ui/Container";
import { HeaderLogo } from "./HeaderLogo";

const noopSubscribe = () => () => {};

export function Header({ data }: { data: HeaderData }) {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);

  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const count = mounted ? cartCount(lines) : 0;
  const { logo, tagline, menu, language, order, cart } = data;

  const vars = {
    "--hdr-bg": data.background,
    "--hdr-link": menu?.color,
    "--hdr-link-hover": menu?.hoverColor,
    "--hdr-btn-bg": order?.background,
    "--hdr-btn-fg": order?.color,
    "--hdr-cart": cart?.color,
    "--hdr-badge": cart?.badge,
    "--hdr-menu-font": menu?.font ?? "inherit",
    "--hdr-btn-font": order?.font ?? "inherit",
    "--hdr-menu-weight": menu?.weight ?? "inherit",
    "--hdr-btn-weight": order?.weight ?? "500",
  } as CSSProperties;

  const linkProps = (l: { href: string; newTab: boolean }) =>
    l.newTab ? { href: l.href, target: "_blank", rel: "noopener noreferrer" } : { href: l.href };

  const orderClass =
    "items-center justify-center rounded-full border border-transparent bg-[var(--hdr-btn-bg)] font-[family-name:var(--hdr-btn-font)] [font-weight:var(--hdr-btn-weight)] text-[var(--hdr-btn-fg)] transition-[filter] duration-200 hover:brightness-90";

  return (
    <header
      style={vars}
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled
          ? "shadow-soft backdrop-blur-md bg-[color-mix(in_srgb,var(--hdr-bg)_92%,transparent)]"
          : "bg-[var(--hdr-bg)]"
      }`}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
          {logo || tagline ? <HeaderLogo logo={logo} tagline={tagline} /> : <span />}

          {menu && (
            <nav className="hidden items-center gap-7 lg:flex" aria-label={dict.nav.catalog}>
              {menu.items.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  {...linkProps(l)}
                  className="font-[family-name:var(--hdr-menu-font)] [font-weight:var(--hdr-menu-weight)] text-[14px] text-[var(--hdr-link)] opacity-85 transition-colors hover:text-[var(--hdr-link-hover)] hover:opacity-100"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {language && <LocaleSwitch className="hidden sm:flex" accent={language.color} />}

            {order && (
              <a {...linkProps(order)} className={`${orderClass} hidden h-11 px-7 text-[12.5px] sm:inline-flex`}>
                {order.text}
              </a>
            )}

            {cart && (
              <button
                type="button"
                onClick={openCart}
                className="relative grid h-11 w-11 place-items-center rounded-full text-[var(--hdr-cart)] transition-colors hover:bg-black/5"
                aria-label={count ? `${dict.header.cartWithCount} ${count}` : dict.header.cartEmpty}
              >
                <CartIcon className="w-[22px]" />
                {count > 0 && (
                  <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--hdr-badge)] px-1 text-[11px] font-semibold text-cream">
                    {count}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-[var(--hdr-link)] transition-colors hover:bg-black/5 lg:hidden"
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
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-[var(--hdr-bg)] px-6 py-6 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label={dict.nav.catalog}
        >
          <div className="flex items-center justify-between">
            {logo || tagline ? <HeaderLogo logo={logo} tagline={tagline} /> : <span />}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-full text-[var(--hdr-link)] hover:bg-black/5"
              aria-label={dict.header.closeMenu}
            >
              <CloseIcon className="w-5" />
            </button>
          </div>

          {menu && (
            <div className="mt-9 flex flex-col gap-1">
              {menu.items.map((l, i) => (
                <a
                  key={`${l.href}-${i}`}
                  {...linkProps(l)}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-green-200/50 py-3.5 font-[family-name:var(--hdr-menu-font)] [font-weight:var(--hdr-menu-weight)] text-[17px] text-[var(--hdr-link)]"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4">
            {order && (
              <a {...linkProps(order)} onClick={() => setMenuOpen(false)} className={`${orderClass} inline-flex h-12 w-full px-7 text-[14px]`}>
                {order.text}
              </a>
            )}

            {language && (
              <div className="flex items-center justify-between gap-3 border-t border-green-200/50 pt-4">
                <span className="text-[13px] text-muted">{dict.header.switchLanguage}</span>
                <LocaleSwitch accent={language.color} />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

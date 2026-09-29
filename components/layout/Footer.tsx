"use client";

import { navLinks, siteConfig } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function Footer() {
  const { locale, dict } = useI18n();

  return (
    <footer className="bg-cream py-9">
      <Container>
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Logo />

          <nav
            aria-label={dict.nav.catalog}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2.5"
          >
            {navLinks.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-[12.5px] text-green-900/80 transition-colors hover:text-green-700"
              >
                {dict.nav[l.key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-green-900 transition-colors hover:text-green-700"
            >
              <InstagramIcon className="w-[15px]" />@{siteConfig.instagram}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="text-[12.5px] text-muted transition-colors hover:text-green-700"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <p className="mt-6 border-t border-green-200/50 pt-5 text-center text-[11px] text-muted">
          {dict.footer.copyright(new Date().getFullYear(), siteConfig.city[locale])}
        </p>
      </Container>
    </footer>
  );
}

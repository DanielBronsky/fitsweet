"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/context";
import { GlobeIcon } from "@/components/ui/Icons";

let pendingAnchor: { index: number; offset: number } | null = null;

function rememberAnchor() {
  const blocks = Array.from(document.querySelectorAll("main > *"));
  const index = blocks.findIndex((el) => el.getBoundingClientRect().bottom > 100);
  pendingAnchor = index < 0 ? null : { index, offset: blocks[index].getBoundingClientRect().top };
}

function restoreAnchor() {
  const anchor = pendingAnchor;
  pendingAnchor = null;
  if (!anchor) return;

  const until = performance.now() + 1200;
  let stopped = false;
  const stop = () => {
    stopped = true;
  };
  window.addEventListener("wheel", stop, { once: true, passive: true });
  window.addEventListener("touchstart", stop, { once: true, passive: true });
  window.addEventListener("keydown", stop, { once: true });

  const pin = () => {
    if (stopped) return;
    const el = document.querySelectorAll("main > *")[anchor.index];
    if (el) {
      const delta = el.getBoundingClientRect().top - anchor.offset;
      if (Math.abs(delta) > 1) window.scrollTo({ top: window.scrollY + delta, behavior: "instant" });
    }
    if (performance.now() < until) requestAnimationFrame(pin);
  };
  requestAnimationFrame(pin);
}

export function LocaleSwitch({
  tone = "dark",
  className = "",
  accent = "var(--color-green-700)",
}: {
  tone?: "dark" | "light";
  className?: string;
  accent?: string;
}) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(restoreAnchor, [pathname]);

  const switchTo = (next: string) => {
    rememberAnchor();
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`, { scroll: false });
  };

  const dark = tone === "dark";

  return (
    <div
      className={`flex items-center gap-1 rounded-full border py-1 pl-2.5 pr-1 ${
        dark ? "border-green-200 bg-white" : "border-cream/40 bg-cream/10"
      } ${className}`}
      style={{ "--locale-accent": accent } as React.CSSProperties}
      role="group"
      aria-label={dict.header.switchLanguage}
    >
      <GlobeIcon className={`w-[15px] ${dark ? "text-[var(--locale-accent)]" : "text-cream"}`} />

      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => !active && switchTo(l)}
            aria-current={active ? "true" : undefined}
            lang={l}
            title={localeNames[l]}
            className={`h-7 rounded-full px-2.5 text-[12px] font-bold tracking-wide transition-colors
              ${
                active
                  ? dark
                    ? "bg-[var(--locale-accent)] text-cream"
                    : "bg-cream text-green-900"
                  : dark
                    ? "text-green-900/70 hover:bg-[color-mix(in_srgb,var(--locale-accent)_12%,transparent)] hover:text-green-900"
                    : "text-cream/75 hover:bg-cream/15 hover:text-cream"
              }`}
          >
            {localeNames[l]}
          </button>
        );
      })}
    </div>
  );
}

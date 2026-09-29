"use client";

import Link from "next/link";
import { siteConfig, taglineByLocale } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale } = useI18n();
  const main = tone === "dark" ? "text-green-900" : "text-cream";
  const sub = tone === "dark" ? "text-green-500" : "text-green-200";

  return (
    <Link href={`/${locale}`} className="group block leading-none" aria-label={siteConfig.name}>
      <span
        className={`font-display text-[27px] tracking-tight transition-colors sm:text-[30px]
          ${main} group-hover:text-green-700`}
      >
        FitSweet
      </span>
      <span className={`label-caps mt-[3px] block ${sub}`}>{taglineByLocale[locale]}</span>
    </Link>
  );
}

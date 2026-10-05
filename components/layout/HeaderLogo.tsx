"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import type { HeaderData } from "@/lib/header";

export function HeaderLogo({ logo, tagline }: Pick<HeaderData, "logo" | "tagline">) {
  const { locale } = useI18n();

  return (
    <Link href={`/${locale}`} className="group block leading-none" aria-label={siteConfig.name}>
      {logo?.kind === "text" && (
        <span
          style={{ color: logo.color, fontFamily: logo.font, fontWeight: logo.weight }}
          className="font-display text-[27px] tracking-tight transition-opacity group-hover:opacity-80 sm:text-[30px]"
        >
          {logo.text}
        </span>
      )}
      {logo?.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.src}
          srcSet={logo.srcSet}
          width={logo.width}
          height={logo.height}
          alt={logo.alt}
          className="h-9 w-auto transition-opacity group-hover:opacity-80 lg:h-11"
        />
      )}
      {tagline && (
        <span style={{ color: tagline.color, fontFamily: tagline.font, fontWeight: tagline.weight }} className={`label-caps block whitespace-nowrap ${logo ? "mt-[3px]" : ""}`}>
          {tagline.text}
        </span>
      )}
    </Link>
  );
}

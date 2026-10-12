import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import type { ResponsiveVariant } from "@/cms/media/frames";
import type { PictureData } from "@/components/ui/ResponsivePicture";
import { getCms, imageAlt, imageFrame } from "./cms";
import { getDictionary, type Locale } from "./i18n";

type Button = { text: string; font?: string; weight?: string } & ResolvedLink;

export type FinalCtaData = {
  background: string;
  lines: string[];
  color: string;
  font?: string;
  weight?: string;
  subtitle: { text: string; color: string; font?: string; weight?: string } | null;
  leaf: string | null;
  media: { picture: PictureData | null; staticSrc?: string; opacity: number; fade: boolean } | null;
  primary: Button & { background: string; color: string };
  secondary: (Button & { color: string }) | null;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

export const getFinalCtaData = cache(async (locale: Locale): Promise<FinalCtaData | null> => {
  const doc = await (await getCms())
    .findGlobal({ slug: "finalCtaSection", depth: 1 })
    .catch(() => null);
  const d = getDictionary(locale).finalCta;

  if (!doc?.updatedAt) {
    return {
      background: "var(--color-olive)",
      lines: [d.line1, d.line2],
      color: "var(--color-cream)",
      subtitle: { text: d.subtitle, color: "var(--color-cream)" },
      leaf: "var(--color-green-200)",
      media: { picture: null, staticSrc: "/images/hero/bars.svg", opacity: 70, fade: true },
      primary: { text: d.cta, href: "#catalog", newTab: false, background: "var(--color-cream)", color: "var(--color-green-900)" },
      secondary: null,
    };
  }
  if (doc.section?.show === false) return null;

  const h = doc.heading;
  const m = doc.media;
  const p = doc.primary;
  const s = doc.secondary;
  const text = h?.text?.[locale] || `${d.line1}\n${d.line2}`;

  return {
    background: css(doc.section?.background, "olive"),
    lines: text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
    color: css(h?.color, "cream"),
    font: fontToCss(h?.font),
    weight: h?.weight ?? undefined,
    subtitle: h?.subtitle?.[locale]
      ? { text: h.subtitle[locale]!, color: css(h?.subtitleColor, "cream"), font: fontToCss(h?.subtitleFont), weight: h?.subtitleWeight ?? undefined }
      : null,
    leaf: h?.leaf === false ? null : css(h?.leafColor, "green-200"),
    media:
      m?.show !== false && m?.picture?.image
        ? {
            picture: {
              desktop: imageFrame<ResponsiveVariant>(m.picture, "desktop"),
              mobile: imageFrame<ResponsiveVariant>(m.picture, "mobile"),
              alt: imageAlt(m.picture, locale),
            },
            opacity: Math.min(100, Math.max(10, m.opacity ?? 70)),
            fade: m.fade !== false,
          }
        : null,
    primary: {
      text: p?.text?.[locale] || d.cta,
      ...resolveLink(p),
      background: css(p?.background, "cream"),
      color: css(p?.color, "green-900"),
      font: fontToCss(p?.font),
      weight: p?.weight ?? undefined,
    },
    secondary:
      s?.show && s.text?.[locale]
        ? { text: s.text[locale]!, ...resolveLink(s), color: css(s.color, "cream"), font: fontToCss(s.font), weight: s.weight ?? undefined }
        : null,
  };
});

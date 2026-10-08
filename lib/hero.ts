import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import type { ResponsiveVariant } from "@/cms/media/frames";
import type { LogoVariants } from "@/cms/media/generate";
import type { Hero as HeroDoc } from "@/payload-types";
import type { PictureData } from "@/components/ui/ResponsivePicture";
import { getCms, imageAlt, imageFrame } from "./cms";
import { getDictionary, type Locale } from "./i18n";
import { featureKeys } from "./site";

type TextStyle = { color: string; font?: string; weight?: string };

export type HeroButton = { text: string; background: string; color: string; border?: string; font?: string; weight?: string } & ResolvedLink;

export type HeroFeature = {
  text: string;
  icon: string;
  image?: { src: string; srcSet?: string; width: number; height: number };
};

export type HeroData = {
  background: string;
  heading: { lines: { text: string; color: string }[]; font?: string; weight?: string; scale: number };
  subtitle: ({ text: string } & TextStyle) | null;
  buttons: HeroButton[];
  media: { picture: PictureData | null; staticSrc?: string; background: string; stamp: { text: string; color: string } | null } | null;
  features: ({ items: HeroFeature[]; iconColor: string } & TextStyle) | null;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

function fallbackHero(locale: Locale): HeroData {
  const d = getDictionary(locale).hero;
  return {
    background: "var(--color-cream)",
    heading: {
      lines: [
        { text: d.line1, color: "var(--color-green-900)" },
        { text: d.line2, color: "var(--color-green-500)" },
        { text: d.line3, color: "var(--color-green-500)" },
      ],
      scale: 1,
    },
    subtitle: { text: d.subtitle, color: "var(--color-muted)" },
    buttons: [
      { text: d.ctaPrimary, href: "#catalog", newTab: false, background: "var(--color-green-700)", color: "var(--color-cream)" },
      {
        text: d.ctaSecondary,
        href: "#order",
        newTab: false,
        background: "var(--color-white)",
        color: "var(--color-green-900)",
        border: "var(--color-green-200)",
      },
    ],
    media: {
      picture: null,
      staticSrc: "/images/hero/bars.svg",
      background: "var(--color-sage)",
      stamp: { text: "FIT & SWEET · GUILT-FREE ·", color: "var(--color-green-700)" },
    },
    features: {
      items: featureKeys.map((k) => ({ text: d.features[k], icon: k })),
      iconColor: "var(--color-green-700)",
      color: "var(--color-green-900)",
    },
  };
}

function logoImage(v: unknown) {
  const logo = v as LogoVariants | null | undefined;
  if (!logo?.src) return undefined;
  return {
    src: logo.src,
    srcSet: logo.srcset.length ? logo.srcset.map((s) => `${s.src} ${s.density}x`).join(", ") : undefined,
    width: logo.width,
    height: logo.height,
  };
}

function toHeroData(doc: HeroDoc, locale: Locale): HeroData | null {
  if (doc.section?.show === false) return null;

  const lines = (doc.heading?.lines ?? [])
    .map((l) => ({ text: l.text?.[locale] ?? "", color: css(l.color, "green-900") }))
    .filter((l) => l.text);

  const sub = doc.subtitle;
  const media = doc.media;
  const picture = media?.picture;
  const features = doc.features;

  return {
    background: css(doc.section?.background, "cream"),
    heading: {
      lines,
      font: fontToCss(doc.heading?.font),
      weight: doc.heading?.weight ?? undefined,
      scale: Number(doc.heading?.size ?? 100) / 100,
    },
    subtitle:
      sub?.show !== false && sub?.text?.[locale]
        ? { text: sub.text[locale], color: css(sub.color, "muted"), font: fontToCss(sub.font), weight: sub.weight ?? undefined }
        : null,
    buttons: (doc.buttons?.items ?? [])
      .filter((b) => b.text?.[locale])
      .map((b) => ({
        text: b.text[locale],
        ...resolveLink(b),
        background: css(b.background, "green-700"),
        color: css(b.color, "cream"),
        border: colorToCss(b.border),
        font: fontToCss(b.font),
        weight: b.weight ?? undefined,
      })),
    media:
      media?.show !== false
        ? {
            picture: picture?.image
              ? {
                  desktop: imageFrame<ResponsiveVariant>(picture, "desktop"),
                  mobile: imageFrame<ResponsiveVariant>(picture, "mobile"),
                  alt: imageAlt(picture, locale),
                }
              : null,
            background: css(media?.background, "sage"),
            stamp:
              media?.stampShow !== false
                ? { text: media?.stampText || "FIT & SWEET · GUILT-FREE ·", color: css(media?.stampColor, "green-700") }
                : null,
          }
        : null,
    features:
      features?.show !== false && features?.items?.length
        ? {
            items: features.items
              .filter((i) => i.text?.[locale])
              .map((i) => ({
                text: i.text[locale],
                icon: i.icon,
                image: i.icon === "custom" ? logoImage(i.iconImage?.variants) : undefined,
              })),
            iconColor: css(features.iconColor, "green-700"),
            color: css(features.color, "green-900"),
            font: fontToCss(features.font),
            weight: features.weight ?? undefined,
          }
        : null,
  };
}

export const getHeroData = cache(async (locale: Locale): Promise<HeroData | null> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "hero", depth: 1 });
    if (!doc.updatedAt) return fallbackHero(locale);
    return toHeroData(doc, locale);
  } catch (err) {
    console.error("[cms] не удалось загрузить баннер:", err);
    return fallbackHero(locale);
  }
});

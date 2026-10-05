import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import type { LogoVariants } from "@/cms/media/generate";
import type { Header as HeaderDoc } from "@/payload-types";
import { getCms } from "./cms";
import { getDictionary, type Locale } from "./i18n";
import { navLinks, siteConfig, taglineByLocale } from "./site";

export type HeaderData = {
  background: string;
  logo:
    | { kind: "text"; text: string; color: string; font?: string; weight?: string }
    | { kind: "image"; src: string; srcSet?: string; width: number; height: number; alt: string }
    | null;
  tagline: { text: string; color: string; font?: string; weight?: string } | null;
  menu: { items: ({ label: string } & ResolvedLink)[]; color: string; hoverColor: string; font?: string; weight?: string } | null;
  language: { color: string } | null;
  order: ({ text: string; background: string; color: string; font?: string; weight?: string } & ResolvedLink) | null;
  cart: { color: string; badge: string } | null;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

function fallbackHeader(locale: Locale): HeaderData {
  const dict = getDictionary(locale);
  return {
    background: "var(--color-cream)",
    logo: { kind: "text", text: siteConfig.name, color: "var(--color-green-900)" },
    tagline: { text: taglineByLocale[locale], color: "var(--color-green-500)" },
    menu: {
      items: navLinks.map((l) => ({ label: dict.nav[l.key], href: l.href, newTab: Boolean(l.external) })),
      color: "var(--color-green-900)",
      hoverColor: "var(--color-green-700)",
    },
    language: { color: "var(--color-green-700)" },
    order: { text: dict.header.order, href: "#order", newTab: false, background: "var(--color-green-700)", color: "var(--color-cream)" },
    cart: { color: "var(--color-green-900)", badge: "var(--color-green-700)" },
  };
}

function toHeaderData(doc: HeaderDoc, locale: Locale): HeaderData {
  const logo = doc.logo;
  const logoImage = logo?.image?.variants as LogoVariants | null | undefined;
  const logoMedia = logo?.image?.image;
  const logoAlt = (logoMedia && typeof logoMedia === "object" && logoMedia.alt?.[locale]) || siteConfig.name;

  let logoData: HeaderData["logo"] = null;
  if (logo?.show !== false) {
    if (logo?.kind === "image" && logoImage?.src) {
      logoData = {
        kind: "image",
        src: logoImage.src,
        srcSet: logoImage.srcset.length ? logoImage.srcset.map((s) => `${s.src} ${s.density}x`).join(", ") : undefined,
        width: logoImage.width,
        height: logoImage.height,
        alt: logoAlt,
      };
    } else {
      logoData = {
        kind: "text",
        text: logo?.text || siteConfig.name,
        color: css(logo?.color, "green-900"),
        font: fontToCss(logo?.font),
        weight: logo?.weight ?? undefined,
      };
    }
  }

  const taglineText = doc.tagline?.text?.[locale];
  const items = (doc.menu?.items ?? []).map((i) => ({ label: i.label[locale], ...resolveLink(i) }));

  return {
    background: css(doc.style?.background, "cream"),
    logo: logoData,
    tagline:
      doc.tagline?.show !== false && taglineText
        ? { text: taglineText, color: css(doc.tagline?.color, "green-500"), font: fontToCss(doc.tagline?.font), weight: doc.tagline?.weight ?? undefined }
        : null,
    menu:
      doc.menu?.show !== false && items.length
        ? {
            items,
            color: css(doc.menu?.color, "green-900"),
            hoverColor: css(doc.menu?.hoverColor, "green-700"),
            font: fontToCss(doc.menu?.font),
            weight: doc.menu?.weight ?? undefined,
          }
        : null,
    language: doc.language?.show !== false ? { color: css(doc.language?.color, "green-700") } : null,
    order:
      doc.order?.show !== false && doc.order?.text?.[locale]
        ? {
            text: doc.order.text[locale],
            ...resolveLink(doc.order),
            background: css(doc.order.background, "green-700"),
            color: css(doc.order.color, "cream"),
            font: fontToCss(doc.order.font),
            weight: doc.order.weight ?? undefined,
          }
        : null,
    cart: doc.cart?.show !== false ? { color: css(doc.cart?.color, "green-900"), badge: css(doc.cart?.badge, "green-700") } : null,
  };
}

export const getHeaderData = cache(async (locale: Locale): Promise<HeaderData> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "header", depth: 1 });
    if (!doc.updatedAt) return fallbackHeader(locale);
    return toHeaderData(doc, locale);
  } catch (err) {
    console.error("[cms] не удалось загрузить шапку:", err);
    return fallbackHeader(locale);
  }
});

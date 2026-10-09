import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import type { ResponsiveVariant } from "@/cms/media/frames";
import type { DeliverySection as DeliveryDoc } from "@/payload-types";
import type { PictureData } from "@/components/ui/ResponsivePicture";
import { getCms, imageAlt, imageFrame } from "./cms";
import { sectionTitle, type SectionTitleData } from "./catalog";
import { getDictionary, type Locale } from "./i18n";
import { DELIVERY_PRICE, FREE_DELIVERY_FROM } from "./delivery";

export type ShippingRules = { price: number; freeFrom: number };

export type DeliveryData = {
  background: string;
  title: SectionTitleData;
  subtitle: { text: string; color: string } | null;
  media: { picture: PictureData | null; staticSrc?: string; background: string; side: "left" | "right" } | null;
  steps: { items: string[]; numberColor: string; color: string; font?: string } | null;
  terms: { items: { title: string; value: string }[]; background: string; titleColor: string; valueColor: string; font?: string; weight?: string } | null;
  button: ({ text: string; background: string; color: string; font?: string } & ResolvedLink) | null;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

const fill = (text: string, rules: ShippingRules) =>
  text.replaceAll("{price}", String(rules.price)).replaceAll("{free}", String(rules.freeFrom));

const getDoc = cache(async (): Promise<DeliveryDoc | null> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "deliverySection", depth: 1 });
    return doc.updatedAt ? doc : null;
  } catch (err) {
    console.error("[cms] не удалось загрузить «Доставку»:", err);
    return null;
  }
});

export const getShippingRules = cache(async (): Promise<ShippingRules> => {
  const doc = await getDoc();
  return {
    price: doc?.pricing?.price ?? DELIVERY_PRICE,
    freeFrom: doc?.pricing?.freeFrom ?? FREE_DELIVERY_FROM,
  };
});

function fallbackDelivery(locale: Locale): DeliveryData {
  const d = getDictionary(locale).delivery;
  return {
    background: "var(--color-beige)",
    title: { text: d.title, color: "var(--color-green-900)", leafColor: "var(--color-green-500)", leaf: true },
    subtitle: { text: d.subtitle, color: "var(--color-muted)" },
    media: { picture: null, staticSrc: "/images/delivery/box.svg", background: "var(--color-cream)", side: "left" },
    steps: { items: d.steps, numberColor: "var(--color-green-500)", color: "var(--color-green-900)" },
    terms: {
      items: d.terms,
      background: "var(--color-white)",
      titleColor: "var(--color-muted)",
      valueColor: "var(--color-green-900)",
    },
    button: { text: d.cta, href: "#order", newTab: false, background: "var(--color-green-700)", color: "var(--color-cream)" },
  };
}

export const getDeliveryData = cache(async (locale: Locale): Promise<DeliveryData | null> => {
  const doc = await getDoc();
  if (!doc) return fallbackDelivery(locale);
  if (doc.section?.show === false) return null;
  const d = getDictionary(locale).delivery;
  const rules = await getShippingRules();
  const m = doc.media;
  const st = doc.steps;
  const t = doc.terms;
  const b = doc.button;

  return {
    background: css(doc.section?.background, "beige"),
    title: sectionTitle(doc.heading, locale, d.title),
    subtitle: doc.heading?.subtitle?.[locale]
      ? { text: doc.heading.subtitle[locale]!, color: css(doc.heading?.subtitleColor, "muted") }
      : null,
    media:
      m?.show !== false
        ? {
            picture: m?.picture?.image
              ? {
                  desktop: imageFrame<ResponsiveVariant>(m.picture, "desktop"),
                  mobile: null,
                  alt: imageAlt(m.picture, locale),
                }
              : null,
            background: css(m?.background, "cream"),
            side: m?.side === "right" ? "right" : "left",
          }
        : null,
    steps:
      st?.show !== false && st?.items?.length
        ? {
            items: st.items.map((i) => i.text?.[locale] ?? "").filter(Boolean),
            numberColor: css(st.numberColor, "green-500"),
            color: css(st.color, "green-900"),
            font: fontToCss(st.font),
          }
        : null,
    terms:
      t?.show !== false && t?.items?.length
        ? {
            items: t.items.map((i) => ({ title: fill(i.title?.[locale] ?? "", rules), value: fill(i.value?.[locale] ?? "", rules) })),
            background: css(t.background, "white"),
            titleColor: css(t.titleColor, "muted"),
            valueColor: css(t.valueColor, "green-900"),
            font: fontToCss(t.font),
            weight: t.weight ?? undefined,
          }
        : null,
    button:
      b?.show !== false && b?.text?.[locale]
        ? {
            text: b.text[locale],
            ...resolveLink(b),
            background: css(b.background, "green-700"),
            color: css(b.color, "cream"),
            font: fontToCss(b.font),
          }
        : null,
  };
});

import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import type { WhereSection as WhereDoc } from "@/payload-types";
import { getCms, getPalette } from "./cms";
import { sectionTitle, type SectionTitleData } from "./catalog";
import { getDictionary, type Locale } from "./i18n";
import { salePoints as fallbackPoints } from "./locations";
import type { SalePoint } from "./types";

export type WhereData = {
  background: string;
  title: SectionTitleData;
  subtitle: { text: string; color: string } | null;
  categories: { key: string; label: string }[];
  allLabel: string;
  points: SalePoint[];
  style: {
    chipActive: string;
    chipBorder: string;
    cardBackground: string;
    cardActive: string;
    nameColor: string;
    infoColor: string;
    pinColor: string;
    nameFont?: string;
  };
  empty: string;
  more: { initialCount: number; showAll: string; collapse: string; background: string; color: string };
  showMap: boolean;
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

function fallbackWhere(locale: Locale): WhereData {
  const d = getDictionary(locale).where;
  return {
    background: "var(--color-beige)",
    title: { text: d.title, color: "var(--color-green-900)", leafColor: "var(--color-green-500)", leaf: true },
    subtitle: { text: d.subtitle, color: "var(--color-muted)" },
    categories: (["cafe", "gym", "shop", "gas"] as const).map((k) => ({ key: k, label: d.categories[k] })),
    allLabel: d.categories.all,
    points: fallbackPoints.map((p) => ({ ...p, hours: p.hours ?? d.aroundTheClock })),
    style: {
      chipActive: "var(--color-green-700)",
      chipBorder: "var(--color-green-200)",
      cardBackground: "var(--color-white)",
      cardActive: "var(--color-green-700)",
      nameColor: "var(--color-green-900)",
      infoColor: "var(--color-muted)",
      pinColor: "#6b7a52",
    },
    empty: d.empty,
    more: {
      initialCount: 4,
      showAll: d.showAll(0).replace("0", "{n}"),
      collapse: d.collapse,
      background: "var(--color-green-700)",
      color: "var(--color-cream)",
    },
    showMap: true,
  };
}

async function resolvePinColor(value: string | null | undefined): Promise<string> {
  if (!value) return "#6b7a52";
  if (value.startsWith("#")) return value;
  const palette = (await getPalette()) as Record<string, string>;
  return palette[value] ?? "#6b7a52";
}

export const getWhereData = cache(async (locale: Locale): Promise<WhereData | null> => {
  const d = getDictionary(locale).where;
  try {
    const payload = await getCms();
    const doc: WhereDoc = await payload.findGlobal({ slug: "whereSection", depth: 0 });
    if (!doc.updatedAt) return fallbackWhere(locale);
    if (doc.section?.show === false) return null;

    const [cats, pts] = await Promise.all([
      payload.find({ collection: "pointCategories", depth: 0, limit: 0, pagination: false, sort: "_order" }),
      payload.find({
        collection: "salePoints",
        depth: 0,
        limit: 0,
        pagination: false,
        sort: "_order",
        where: { active: { equals: true } },
      }),
    ]);
    const slugById = new Map(cats.docs.map((c) => [c.id, c.slug ?? String(c.id)]));
    const allDay = doc.list?.allDay?.[locale] || d.aroundTheClock;
    const l = doc.list;
    const m = doc.more;

    const points: SalePoint[] = pts.docs
      .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
      .map((p) => ({
        id: String(p.id),
        name: p.name,
        address: { ru: p.address?.ru ?? "", ro: p.address?.ro || p.address?.ru || "" },
        hours: p.allDay ? allDay : p.hours || null,
        category: typeof p.category === "number" ? (slugById.get(p.category) ?? "") : (p.category?.slug ?? ""),
        coords: [p.lat, p.lng] as [number, number],
      }));
    const usedCats = new Set(points.map((p) => p.category));

    return {
      background: css(doc.section?.background, "beige"),
      title: sectionTitle(doc.heading, locale, d.title),
      subtitle: doc.heading?.subtitle?.[locale]
        ? { text: doc.heading.subtitle[locale]!, color: css(doc.heading?.subtitleColor, "muted") }
        : null,
      categories: cats.docs
        .filter((c) => c.slug && usedCats.has(c.slug))
        .map((c) => ({ key: c.slug!, label: c.title?.[locale] || c.title?.ru || "" })),
      allLabel: l?.allLabel?.[locale] || d.categories.all,
      points,
      style: {
        chipActive: css(l?.chipActive, "green-700"),
        chipBorder: css(l?.chipBorder, "green-200"),
        cardBackground: css(l?.cardBackground, "white"),
        cardActive: css(l?.cardActive, "green-700"),
        nameColor: css(l?.nameColor, "green-900"),
        infoColor: css(l?.infoColor, "muted"),
        pinColor: await resolvePinColor(l?.pinColor),
        nameFont: fontToCss(l?.nameFont),
      },
      empty: l?.empty?.[locale] || d.empty,
      more: {
        initialCount: Math.max(1, m?.initialCount ?? 4),
        showAll: m?.showAll?.[locale] || "{n}",
        collapse: m?.collapse?.[locale] || d.collapse,
        background: css(m?.background, "green-700"),
        color: css(m?.color, "cream"),
      },
      showMap: doc.map?.show !== false,
    };
  } catch (err) {
    console.error("[cms] не удалось загрузить «Где купить»:", err);
    return fallbackWhere(locale);
  }
});

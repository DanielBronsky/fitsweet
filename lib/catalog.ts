import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import type { ResponsiveVariant } from "@/cms/media/frames";
import type { Catalog as CatalogDoc, Mood as MoodDoc, MoodsSection as MoodsSectionDoc, Product as ProductDoc } from "@/payload-types";
import { getCms, imageFrame } from "./cms";
import { getDictionary, type Locale } from "./i18n";
import { fallbackProducts } from "./products";
import { fallbackMoods, type Mood } from "./moods";
import type { Product, ProductThumb } from "./types";

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

function thumbOf(card: ResponsiveVariant | null): ProductThumb | undefined {
  if (!card) return undefined;
  return {
    src: card.srcset[Math.min(1, card.srcset.length - 1)].src,
    srcSet: card.srcset.map((s) => `${s.src} ${s.w}w`).join(", "),
    width: card.width,
    height: card.height,
  };
}

export const getMoods = cache(async (): Promise<Mood[]> => {
  try {
    const payload = await getCms();
    const all = await payload.count({ collection: "moods" });
    if (!all.totalDocs) return fallbackMoods;
    const { docs } = await payload.find({
      collection: "moods",
      depth: 1,
      limit: 0,
      pagination: false,
      sort: "_order",
      where: { active: { equals: true } },
    });
    return docs.map(toMood).filter((m): m is Mood => Boolean(m));
  } catch (err) {
    console.error("[cms] не удалось загрузить настроения:", err);
    return fallbackMoods;
  }
});

function toMood(doc: MoodDoc): Mood | null {
  if (!doc.slug || !doc.title?.ru) return null;
  const card = imageFrame<ResponsiveVariant>(doc.picture, "card");
  return {
    key: doc.slug,
    title: { ru: doc.title.ru, ro: doc.title.ro || doc.title.ru },
    image: card?.srcset[0]?.src ?? "",
    thumb: thumbOf(card),
  };
}

type CategoryInfo = { slug: string; inBox: boolean; inMoods: boolean; weightLabel?: { ru: string; ro: string } };

const getCategoryMap = cache(async (): Promise<Map<number, CategoryInfo>> => {
  const { docs } = await (await getCms()).find({ collection: "productCategories", depth: 0, limit: 0, pagination: false });
  return new Map(
    docs.map((d) => [
      d.id,
      {
        slug: d.slug ?? String(d.id),
        inBox: Boolean(d.inBox),
        inMoods: Boolean(d.inMoods),
        weightLabel: d.weightLabel?.ru ? { ru: d.weightLabel.ru, ro: d.weightLabel.ro || d.weightLabel.ru } : undefined,
      },
    ]),
  );
});

const getMoodSlugs = cache(async (): Promise<Map<number, string>> => {
  const { docs } = await (await getCms()).find({ collection: "moods", depth: 0, limit: 0, pagination: false });
  return new Map(docs.filter((d) => d.slug).map((d) => [d.id, d.slug as string]));
});

function toProduct(doc: ProductDoc, moodSlugs: Map<number, string>, categories: Map<number, CategoryInfo>): Product | null {
  if (!doc.slug || !doc.name?.ru) return null;
  const card = imageFrame<ResponsiveVariant>(doc.picture, "card");
  const shortRu = doc.shortName?.ru?.trim();
  const shortRo = doc.shortName?.ro?.trim();
  return {
    id: doc.slug,
    name: { ru: doc.name.ru, ro: doc.name.ro || doc.name.ru },
    shortName: shortRu || shortRo ? { ru: shortRu || doc.name.ru, ro: shortRo || doc.name.ro || doc.name.ru } : undefined,
    price: doc.price ?? 0,
    weight: doc.weight ?? 0,
    kbju: { kcal: doc.kcal ?? 0, protein: doc.protein ?? 0, fat: doc.fat ?? 0, carbs: doc.carbs ?? 0 },
    moods: (doc.moods ?? [])
      .map((m) => (typeof m === "number" ? moodSlugs.get(m) : m.slug))
      .filter((s): s is string => Boolean(s)),
    ingredients: { ru: doc.ingredients?.ru ?? "", ro: doc.ingredients?.ro ?? "" },
    image: card?.srcset[0]?.src ?? "",
    thumb: thumbOf(card),
    ...(() => {
      const id = typeof doc.category === "object" ? doc.category?.id : doc.category;
      const info = id ? categories.get(id) : undefined;
      return info
        ? { category: info.slug, inBox: info.inBox, inMoods: info.inMoods, weightLabel: info.weightLabel }
        : { inBox: true, inMoods: true };
    })(),
  };
}

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const { docs, totalDocs } = await (await getCms()).find({
      collection: "products",
      depth: 0,
      limit: 0,
      pagination: false,
      sort: "_order",
      where: { active: { equals: true } },
    });
    if (!totalDocs) {
      const any = await (await getCms()).count({ collection: "products" });
      return any.totalDocs ? [] : fallbackProducts;
    }
    const [moodSlugs, categories] = await Promise.all([getMoodSlugs(), getCategoryMap()]);
    return docs.map((d) => toProduct(d, moodSlugs, categories)).filter((p): p is Product => Boolean(p));
  } catch (err) {
    console.error("[cms] не удалось загрузить товары:", err);
    return fallbackProducts;
  }
});

export type SectionTitleData = { text: string; color: string; leafColor: string; leaf: boolean; font?: string; weight?: string };

export type CatalogData = {
  background: string;
  category?: string;
  title: SectionTitleData;
  cards: {
    background: string;
    nameColor: string;
    infoColor: string;
    priceColor: string;
    nameFont?: string;
    nameWeight?: string;
    blendPhoto: boolean;
    addText: string;
    addedText: string;
    buttonColor: string;
    buttonActive: string;
  };
  more: { text: string; background: string; color: string; border: string; font?: string; initialCount: number } | null;
};

function fallbackCatalog(locale: Locale): CatalogData {
  const d = getDictionary(locale).catalog;
  return {
    background: "var(--color-white)",
    title: { text: d.title, color: "var(--color-green-900)", leafColor: "var(--color-green-500)", leaf: true },
    cards: {
      background: "var(--color-card)",
      nameColor: "var(--color-green-900)",
      infoColor: "var(--color-muted)",
      priceColor: "var(--color-green-900)",
      blendPhoto: true,
      addText: d.addToCart,
      addedText: d.added,
      buttonColor: "var(--color-green-700)",
      buttonActive: "var(--color-green-700)",
    },
    more: {
      text: d.viewAll,
      background: "var(--color-white)",
      color: "var(--color-green-900)",
      border: "var(--color-green-200)",
      initialCount: 8,
    },
  };
}

export function sectionTitle(
  h: { text?: { ru?: string | null; ro?: string | null } | null; color?: string | null; leafColor?: string | null; leaf?: boolean | null; font?: string | null; weight?: string | null } | null | undefined,
  locale: Locale,
  fallbackText: string,
): SectionTitleData {
  return {
    text: h?.text?.[locale] || fallbackText,
    color: css(h?.color, "green-900"),
    leafColor: css(h?.leafColor, "green-500"),
    leaf: h?.leaf !== false,
    font: fontToCss(h?.font),
    weight: h?.weight ?? undefined,
  };
}

async function toCatalogData(doc: CatalogDoc, locale: Locale): Promise<CatalogData | null> {
  if (doc.section?.show === false) return null;
  const d = getDictionary(locale).catalog;
  const c = doc.cards;
  const m = doc.more;
  const categoryId = typeof doc.section?.category === "object" ? doc.section?.category?.id : doc.section?.category;
  return {
    background: css(doc.section?.background, "white"),
    category: categoryId ? (await getCategoryMap()).get(categoryId)?.slug : undefined,
    title: sectionTitle(doc.heading, locale, d.title),
    cards: {
      background: css(c?.background, "card"),
      nameColor: css(c?.nameColor, "green-900"),
      infoColor: css(c?.infoColor, "muted"),
      priceColor: css(c?.priceColor, "green-900"),
      nameFont: fontToCss(c?.nameFont),
      nameWeight: c?.nameWeight ?? undefined,
      blendPhoto: c?.blendPhoto !== false,
      addText: c?.addText?.[locale] || d.addToCart,
      addedText: c?.addedText?.[locale] || d.added,
      buttonColor: css(c?.buttonColor, "green-700"),
      buttonActive: css(c?.buttonActive, "green-700"),
    },
    more:
      m?.show !== false
        ? {
            text: m?.text?.[locale] || d.viewAll,
            background: css(m?.background, "white"),
            color: css(m?.color, "green-900"),
            border: css(m?.border, "green-200"),
            font: fontToCss(m?.font),
            initialCount: Math.max(1, m?.initialCount ?? 8),
          }
        : null,
  };
}

export const getCatalogData = cache(async (locale: Locale): Promise<CatalogData | null> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "catalog", depth: 0 });
    if (!doc.updatedAt) return fallbackCatalog(locale);
    return await toCatalogData(doc, locale);
  } catch (err) {
    console.error("[cms] не удалось загрузить каталог:", err);
    return fallbackCatalog(locale);
  }
});

export type MoodsData = {
  background: string;
  title: SectionTitleData;
  cards: {
    background: string;
    activeBorder: string;
    titleColor: string;
    listColor: string;
    titleFont?: string;
    titleWeight?: string;
    showList: boolean;
  };
  more: { text: string; background: string; color: string; border: string; font?: string } | null;
};

function fallbackMoodsSection(locale: Locale): MoodsData {
  const d = getDictionary(locale).moods;
  return {
    background: "var(--color-beige)",
    title: { text: d.title, color: "var(--color-green-900)", leafColor: "var(--color-green-500)", leaf: true },
    cards: {
      background: "var(--color-white)",
      activeBorder: "var(--color-green-700)",
      titleColor: "var(--color-green-900)",
      listColor: "var(--color-muted)",
      showList: true,
    },
    more: { text: d.viewAll, background: "var(--color-white)", color: "var(--color-green-900)", border: "var(--color-green-200)" },
  };
}

function toMoodsData(doc: MoodsSectionDoc, locale: Locale): MoodsData | null {
  if (doc.section?.show === false) return null;
  const d = getDictionary(locale).moods;
  const c = doc.cards;
  const m = doc.more;
  return {
    background: css(doc.section?.background, "beige"),
    title: sectionTitle(doc.heading, locale, d.title),
    cards: {
      background: css(c?.background, "white"),
      activeBorder: css(c?.activeBorder, "green-700"),
      titleColor: css(c?.titleColor, "green-900"),
      listColor: css(c?.listColor, "muted"),
      titleFont: fontToCss(c?.titleFont),
      titleWeight: c?.titleWeight ?? undefined,
      showList: c?.showList !== false,
    },
    more:
      m?.show !== false
        ? {
            text: m?.text?.[locale] || d.viewAll,
            background: css(m?.background, "white"),
            color: css(m?.color, "green-900"),
            border: css(m?.border, "green-200"),
            font: fontToCss(m?.font),
          }
        : null,
  };
}

export const getMoodsData = cache(async (locale: Locale): Promise<MoodsData | null> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "moodsSection", depth: 0 });
    if (!doc.updatedAt) return fallbackMoodsSection(locale);
    return toMoodsData(doc, locale);
  } catch (err) {
    console.error("[cms] не удалось загрузить блок настроений:", err);
    return fallbackMoodsSection(locale);
  }
});

export const getCardStyle = cache(async (locale: Locale): Promise<CatalogData["cards"]> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "catalog", depth: 0 });
    if (!doc.updatedAt) return fallbackCatalog(locale).cards;
    const data = await toCatalogData({ ...doc, section: { ...doc.section, show: true } }, locale);
    return data!.cards;
  } catch {
    return fallbackCatalog(locale).cards;
  }
});

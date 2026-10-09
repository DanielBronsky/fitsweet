import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { reviews } from "./reviews-fallback";
import { getCms } from "./cms";
import { getProducts, sectionTitle, type SectionTitleData } from "./catalog";
import { tileName } from "./products";
import { getDictionary, type Locale } from "./i18n";

export type ReviewsData = {
  background: string;
  title: SectionTitleData;
  subtitle: { text: string; color: string } | null;
  items: { id: string; author: string; text: string; product: string | null }[];
  cards: {
    background: string;
    quoteColor: string;
    textColor: string;
    nameColor: string;
    font?: string;
    chipBackground: string;
    chipColor: string;
  };
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

export const getReviewsData = cache(async (locale: Locale): Promise<ReviewsData | null> => {
  const cms = await getCms();
  const [doc, list, products] = await Promise.all([
    cms.findGlobal({ slug: "reviewsSection", depth: 0 }).catch(() => null),
    cms
      .find({ collection: "reviews", depth: 1, limit: 100, sort: "_order", where: { show: { not_equals: false } } })
      .catch(() => null),
    getProducts(),
  ]);
  if (doc?.section?.show === false) return null;

  const productName = (slug: string | null | undefined) => {
    const p = slug ? products.find((x) => x.id === slug) : null;
    return p ? tileName(p, locale) : null;
  };

  const fromCms = (list?.docs ?? []).map((r) => {
    const product = r.product && typeof r.product === "object" ? r.product.slug : null;
    return { id: String(r.id), author: r.author?.[locale] ?? "", text: r.text?.[locale] ?? "", product: productName(product) };
  });
  const seeded = doc?.updatedAt || (list?.totalDocs ?? 0) > 0;
  const items = seeded
    ? fromCms.filter((r) => r.author && r.text)
    : reviews.map((r) => ({ id: r.id, author: r.name[locale], text: r.text[locale], product: productName(r.productId) }));
  if (items.length === 0) return null;

  const c = doc?.cards;
  const showProduct = c?.showProduct !== false;
  return {
    background: css(doc?.section?.background, "white"),
    title: sectionTitle(doc?.heading, locale, getDictionary(locale).reviews.title),
    subtitle: doc?.heading?.subtitle?.[locale]
      ? { text: doc.heading.subtitle[locale]!, color: css(doc.heading?.subtitleColor, "muted") }
      : null,
    items: showProduct ? items : items.map((r) => ({ ...r, product: null })),
    cards: {
      background: css(c?.background, "card"),
      quoteColor: css(c?.quoteColor, "green-200"),
      textColor: css(c?.textColor, "green-900"),
      nameColor: css(c?.nameColor, "green-900"),
      font: fontToCss(c?.font),
      chipBackground: css(c?.chipBackground, "sage"),
      chipColor: css(c?.chipColor, "green-900"),
    },
  };
});

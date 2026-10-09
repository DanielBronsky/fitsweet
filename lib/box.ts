import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import type { BoxSection as BoxDoc } from "@/payload-types";
import { getCms } from "./cms";
import { sectionTitle, type SectionTitleData } from "./catalog";
import { getDictionary, type Locale } from "./i18n";

export type BoxData = {
  background: string;
  title: SectionTitleData;
  subtitle: { text: string; color: string } | null;
  sizes: number[];
  initial: number;
  texts: { chooseQty: string; yourBox: string; manualPick: string; hideManual: string; total: string; checkout: string; addMore: string };
  style: { panel: string; border: string; accent: string; accentText: string; text: string; muted: string };
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

const DEFAULT_SIZES = [4, 6, 8, 12];

const getDoc = cache(async (): Promise<BoxDoc | null> => {
  try {
    const doc = await (await getCms()).findGlobal({ slug: "boxSection", depth: 0 });
    return doc.updatedAt ? doc : null;
  } catch (err) {
    console.error("[cms] не удалось загрузить «Соберите коробку»:", err);
    return null;
  }
});

export const getBoxData = cache(async (locale: Locale): Promise<BoxData | null> => {
  const doc = await getDoc();
  const d = getDictionary(locale).box;
  if (doc?.section?.show === false) return null;

  const sizes = [...new Set((doc?.sizes?.options ?? DEFAULT_SIZES).filter((n) => n >= 2))].sort((a, b) => a - b);
  const list = sizes.length ? sizes : DEFAULT_SIZES;
  const wanted = doc?.sizes?.initial ?? 8;
  const t = doc?.texts;
  const pick = (v: { ru?: string | null; ro?: string | null } | null | undefined, fallback: string) => v?.[locale] || fallback;
  const s = doc?.style;

  return {
    background: css(doc?.section?.background, "beige"),
    title: sectionTitle(doc?.heading, locale, d.title),
    subtitle: doc?.heading?.subtitle?.[locale]
      ? { text: doc.heading.subtitle[locale]!, color: css(doc.heading?.subtitleColor, "muted") }
      : null,
    sizes: list,
    initial: list.includes(wanted) ? wanted : list[Math.floor((list.length - 1) / 2)],
    texts: {
      chooseQty: pick(t?.chooseQty, d.chooseQty),
      yourBox: pick(t?.yourBox, d.yourBox),
      manualPick: pick(t?.manualPick, d.manualPick),
      hideManual: pick(t?.hideManual, d.hideManual),
      total: pick(t?.total, d.total),
      checkout: pick(t?.checkout, d.checkout),
      addMore: pick(t?.addMore, d.addMore),
    },
    style: {
      panel: css(s?.panel, "white"),
      border: css(s?.border, "green-200"),
      accent: css(s?.accent, "green-700"),
      accentText: css(s?.accentText, "cream"),
      text: css(s?.text, "green-900"),
      muted: css(s?.muted, "muted"),
    },
  };
});

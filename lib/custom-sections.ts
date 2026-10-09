import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import { resolveLink, type ResolvedLink } from "@/cms/fields/link";
import type { ResponsiveVariant } from "@/cms/media/frames";
import type { CustomSection as CustomDoc } from "@/payload-types";
import type { PictureData } from "@/components/ui/ResponsivePicture";
import { getCms, imageAlt, imageFrame } from "./cms";
import { sectionTitle, type SectionTitleData } from "./catalog";
import type { Locale } from "./i18n";

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

type Common = {
  id: number;
  anchor: string;
  background: string;
  title: SectionTitleData;
  align: "center" | "left";
  subtitle: { text: string; color: string } | null;
};

export type CustomButton = ({ text: string; background: string; color: string } & ResolvedLink) | null;

export type CustomSectionData = Common &
  (
    | { template: "products"; category: string; initialCount: number; moreText: string }
    | {
        template: "textImage";
        paragraphs: string[];
        textColor: string;
        picture: PictureData | null;
        side: "left" | "right";
        pictureBackground: string;
        button: CustomButton;
      }
    | {
        template: "features";
        items: { icon: string; title: string; text: string }[];
        columns: number;
        cardBackground: string;
        iconColor: string;
        titleColor: string;
        textColor: string;
        titleFont?: string;
        titleWeight?: string;
      }
    | { template: "gallery"; items: { picture: PictureData; caption: string }[]; columns: number }
    | { template: "faq"; items: { question: string; answer: string }[]; cardBackground: string; questionColor: string; answerColor: string }
  );

const getDocs = cache(async (): Promise<Map<number, CustomDoc>> => {
  try {
    const { docs } = await (await getCms()).find({ collection: "customSections", depth: 2, limit: 0, pagination: false });
    return new Map(docs.map((d) => [d.id, d]));
  } catch (err) {
    console.error("[cms] не удалось загрузить свои разделы:", err);
    return new Map();
  }
});

const pictureOf = (group: Parameters<typeof imageFrame>[0], locale: Locale): PictureData | null => {
  const desktop = imageFrame<ResponsiveVariant>(group, "desktop");
  return desktop ? { desktop, mobile: null, alt: imageAlt(group, locale) } : null;
};

export async function getCustomSection(id: number, locale: Locale): Promise<CustomSectionData | null> {
  const doc = (await getDocs()).get(id);
  if (!doc || doc.show === false) return null;
  const block = doc.content?.[0];
  if (!block) return null;

  const h = doc.heading;
  const common: Common = {
    id: doc.id,
    anchor: doc.anchor || `section-${doc.id}`,
    background: css(doc.background, "white"),
    title: sectionTitle(h, locale, doc.name ?? ""),
    align: h?.align === "left" ? "left" : "center",
    subtitle: h?.subtitle?.[locale] ? { text: h.subtitle[locale]!, color: css(h.subtitleColor, "muted") } : null,
  };

  switch (block.blockType) {
    case "products": {
      const cat = typeof block.category === "object" ? block.category?.slug : null;
      if (!cat) return null;
      return {
        ...common,
        template: "products",
        category: cat,
        initialCount: Math.max(1, block.initialCount ?? 8),
        moreText: block.moreText?.[locale] || (locale === "ro" ? "Vezi toate" : "Смотреть все"),
      };
    }
    case "textImage": {
      const b = block.button;
      return {
        ...common,
        template: "textImage",
        paragraphs: (block.text?.[locale] ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        textColor: css(block.textColor, "muted"),
        picture: block.picture?.image ? pictureOf(block.picture, locale) : null,
        side: block.side === "left" ? "left" : "right",
        pictureBackground: css(block.pictureBackground, "cream"),
        button:
          b?.show && b.text?.[locale]
            ? { text: b.text[locale]!, ...resolveLink(b), background: css(b.background, "green-700"), color: css(b.color, "cream") }
            : null,
      };
    }
    case "features":
      return {
        ...common,
        template: "features",
        items: (block.items ?? []).map((i) => ({ icon: i.icon, title: i.title?.[locale] ?? "", text: i.text?.[locale] ?? "" })),
        columns: Number(block.columns ?? 3),
        cardBackground: css(block.cardBackground, "white"),
        iconColor: css(block.iconColor, "green-700"),
        titleColor: css(block.titleColor, "green-900"),
        textColor: css(block.textColor, "muted"),
        titleFont: fontToCss(block.titleFont),
        titleWeight: block.titleWeight ?? undefined,
      };
    case "gallery":
      return {
        ...common,
        template: "gallery",
        items: (block.items ?? [])
          .map((i) => ({ picture: pictureOf(i.picture, locale), caption: i.caption?.[locale] ?? "" }))
          .filter((i): i is { picture: PictureData; caption: string } => Boolean(i.picture)),
        columns: Number(block.columns ?? 4),
      };
    case "faq":
      return {
        ...common,
        template: "faq",
        items: (block.items ?? []).map((i) => ({ question: i.question?.[locale] ?? "", answer: i.answer?.[locale] ?? "" })),
        cardBackground: css(block.cardBackground, "white"),
        questionColor: css(block.questionColor, "green-900"),
        answerColor: css(block.answerColor, "muted"),
      };
    default:
      return null;
  }
}

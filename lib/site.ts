import type { Locale } from "./i18n/config";

export const siteConfig = {
  name: "FitSweet",
  tagline: "ПП десерты",
  // TODO(данные): подтвердить контакты
  instagram: "fitsweet.md",
  instagramUrl: "https://instagram.com/fitsweet.md",
  phone: "+373 60 000 000",
  city: { ru: "Кишинёв", ro: "Chișinău" },
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fitsweet.md",
  /**
   * Индексация поисковиками. Выключается только на тестовом сервере: SITE_INDEXING=false в .env.
   * Намеренно не в админке — чтобы сайт нельзя было случайно убрать из поиска.
   */
  indexing: process.env.SITE_INDEXING !== "false",
};

export type NavLink = {
  href: string;
  key: "catalog" | "about" | "where" | "delivery" | "reviews" | "instagram";
  external?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "#catalog", key: "catalog" },
  { href: "#about", key: "about" },
  { href: "#where", key: "where" },
  { href: "#delivery", key: "delivery" },
  { href: "#reviews", key: "reviews" },
  { href: siteConfig.instagramUrl, key: "instagram", external: true },
];

export const featureKeys = ["no-sugar", "no-lactose", "no-gluten", "tasty"] as const;
export type FeatureKey = (typeof featureKeys)[number];

/** Подпись под логотипом: на румынском — «deserturi sănătoase» */
export const taglineByLocale: Record<Locale, string> = {
  ru: "ПП десерты",
  ro: "Deserturi sănătoase",
};

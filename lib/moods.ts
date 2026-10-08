import type { Locale } from "./i18n/config";
import type { I18nString, MoodKey } from "./types";
import { tileName } from "./products";
import type { Product, ProductThumb } from "./types";

export type Mood = {
  key: MoodKey;
  title: I18nString;
  image: string;
  thumb?: ProductThumb;
};

export const fallbackMoods: Mood[] = [
  {
    key: "chocolate",
    title: { ru: "Хочется шоколада", ro: "Poftă de ciocolată" },
    image: "/images/moods/chocolate.svg",
  },
  {
    key: "caramel",
    title: { ru: "Любите карамель", ro: "Vă place caramelul" },
    image: "/images/moods/caramel.svg",
  },
  {
    key: "coconut",
    title: { ru: "Мечтаете о кокосе", ro: "Visați la cocos" },
    image: "/images/moods/coconut.svg",
  },
  {
    key: "fruity",
    title: {
      ru: "Хочется чего-то лёгкого и фруктового",
      ro: "Poftă de ceva ușor și fructat",
    },
    image: "/images/moods/fruity.svg",
  },
  {
    key: "nuts-berries",
    title: {
      ru: "Любите сочетание орехов и ягод",
      ro: "Vă place combinația de nuci și fructe de pădure",
    },
    image: "/images/moods/nuts-berries.svg",
  },
];

export const productsByMood = (products: Product[], key: MoodKey) =>
  products.filter((p) => p.moods.includes(key));

export const moodProductNames = (products: Product[], key: MoodKey, locale: Locale) =>
  productsByMood(products, key)
    .map((p) => tileName(p, locale))
    .join(", ");

import type { Locale } from "./i18n/config";
import type { I18nString, MoodKey } from "./types";
import { products, tileName } from "./products";

export type Mood = {
  key: MoodKey;
  title: I18nString;
  image: string;
};

export const moods: Mood[] = [
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

export const productsByMood = (key: MoodKey) =>
  products.filter((p) => p.moods.includes(key));

export const moodProductNames = (key: MoodKey, locale: Locale) =>
  productsByMood(key)
    .map((p) => tileName(p, locale))
    .join(", ");

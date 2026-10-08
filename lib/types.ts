import type { Locale } from "./i18n/config";

export type I18nString = Record<Locale, string>;

export type MoodKey = string;

export type Kbju = {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type Product = {
  id: string;
  name: I18nString;
  shortName?: I18nString;
  price: number;
  weight: number;
  kbju: Kbju;
  moods: MoodKey[];
  ingredients: I18nString;
  image: string;
  thumb?: ProductThumb;
};

export type ProductThumb = { src: string; srcSet: string; width: number; height: number };

export type LocationCategory = string;

export type SalePoint = {
  id: string;
  name: string;
  address: I18nString;
  hours: string | null;
  category: LocationCategory;
  coords: [number, number];
};

export type Review = {
  id: string;
  name: I18nString;
  text: I18nString;
  productId: string;
};

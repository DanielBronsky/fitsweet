import type { Locale } from "./i18n/config";

/** Строка, переведённая на все языки сайта */
export type I18nString = Record<Locale, string>;

export type MoodKey = "chocolate" | "caramel" | "coconut" | "fruity" | "nuts-berries";

export type Kbju = {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type Product = {
  id: string;
  name: I18nString;
  /** Короткое имя для плитки каталога, если полное слишком длинное */
  shortName?: I18nString;
  price: number;
  /** Вес батончика в граммах */
  weight: number;
  kbju: Kbju;
  /**
   * TODO(данные): КБЖУ и вес — заглушка, реальные цифры есть только
   * у «Миндаль-клюква». Заменить, когда заказчик пришлёт лабораторные значения.
   */
  kbjuIsPlaceholder: boolean;
  moods: MoodKey[];
  ingredients: I18nString;
  image: string;
};

export type LocationCategory = "cafe" | "gym" | "shop" | "gas";

export type SalePoint = {
  id: string;
  name: string;
  address: I18nString;
  /** null — работает круглосуточно, подпись берётся из словаря */
  hours: string | null;
  category: LocationCategory;
  /** [lat, lng] — заглушки по Кишинёву, заменить на реальные */
  coords: [number, number];
};

export type Review = {
  id: string;
  name: I18nString;
  text: I18nString;
  /** id товара, о котором отзыв */
  productId: string;
};

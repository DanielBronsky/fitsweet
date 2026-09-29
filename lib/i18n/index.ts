import { ru, type Dictionary } from "./ru";
import { ro } from "./ro";
import { type Locale, defaultLocale, isLocale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { ru, ro };

export const getDictionary = (locale: string): Dictionary =>
  dictionaries[isLocale(locale) ? locale : defaultLocale];

export type { Dictionary };
export * from "./config";

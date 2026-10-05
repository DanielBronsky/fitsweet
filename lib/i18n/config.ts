export const locales = ["ru", "ro"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeNames: Record<Locale, string> = {
  ru: "RU",
  ro: "RO",
};

export const localeTags: Record<Locale, string> = {
  ru: "ru-MD",
  ro: "ro-MD",
};

export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

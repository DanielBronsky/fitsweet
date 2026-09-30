import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultPalette, HEX_RE, paletteTokens, type Palette } from "@/cms/palette";
import type { MediaVariants } from "@/cms/media/crops";
import type { Media } from "@/payload-types";
import type { Locale } from "./i18n/config";

/**
 * Данные из админки для серверных компонентов.
 * Читаются через Local API (без HTTP) во время сборки / revalidate —
 * всё попадает в готовый HTML, что и нужно для SEO.
 */
export const getCms = cache(() => getPayload({ config }));

async function safe<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[cms] не удалось загрузить ${label}:`, err);
    return null;
  }
}

export const getSeo = cache((locale: Locale) =>
  safe("seo", async () => (await getCms()).findGlobal({ slug: "seo", locale, depth: 1 })),
);

export const getPalette = cache(async (): Promise<Palette> => {
  const theme = await safe("theme", async () => (await getCms()).findGlobal({ slug: "theme", depth: 0 }));
  const colors = (theme?.colors ?? {}) as Record<string, string | undefined>;
  const palette = { ...defaultPalette };
  for (const t of paletteTokens) {
    const hex = colors[t.key.replace("-", "_")];
    if (hex && HEX_RE.test(hex)) palette[t.key] = hex;
  }
  return palette;
});

/** Переопределения палитры для <style> — только то, что отличается от дизайна */
export function paletteCss(palette: Palette): string {
  const vars = paletteTokens
    .filter((t) => palette[t.key].toLowerCase() !== t.hex.toLowerCase())
    .map((t) => `--color-${t.key}:${palette[t.key]}`);
  return vars.length ? `:root{${vars.join(";")}}` : "";
}

export function mediaVariants(media: number | Media | null | undefined): MediaVariants | null {
  if (!media || typeof media === "number") return null;
  return (media.variants as unknown as MediaVariants | null) ?? null;
}

export function mediaAlt(media: number | Media | null | undefined, locale: Locale): string {
  if (!media || typeof media === "number") return "";
  return media.alt?.[locale] ?? "";
}

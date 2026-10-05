import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { defaultPalette, HEX_RE, paletteTokens, type Palette } from "@/cms/palette";
import { fontToCss } from "@/cms/fonts";
import type { FixedVariant, ImageVariants, ResponsiveVariant } from "@/cms/media/frames";
import type { Media } from "@/payload-types";
import type { Locale } from "./i18n/config";

export const getCms = cache(() => getPayload({ config }));

async function safe<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[cms] не удалось загрузить ${label}:`, err);
    return null;
  }
}

export const getSeo = cache(() =>
  safe("seo", async () => (await getCms()).findGlobal({ slug: "seo", depth: 1 })),
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

const fontDefaults = { heading: "inter", body: "inter", accent: "playfair" } as const;
const fontVars = { heading: "--font-heading", body: "--font-sans", accent: "--font-display" } as const;

export const getTypographyCss = cache(async (): Promise<string> => {
  const doc = await safe("typography", async () => (await getCms()).findGlobal({ slug: "typography", depth: 0 }));
  const vars = (Object.keys(fontVars) as (keyof typeof fontVars)[])
    .filter((k) => doc?.[k] && doc[k] !== fontDefaults[k])
    .map((k) => `${fontVars[k]}:${fontToCss(doc?.[k])}`)
    .filter((v) => !v.endsWith("undefined"));
  if (doc?.headingWeight && doc.headingWeight !== "700") vars.push(`--fw-heading:${doc.headingWeight}`);
  if (doc?.accentWeight && doc.accentWeight !== "400") vars.push(`--fw-accent:${doc.accentWeight}`);
  return vars.length ? `:root{${vars.join(";")}}` : "";
});

export function paletteCss(palette: Palette): string {
  const vars = paletteTokens
    .filter((t) => palette[t.key].toLowerCase() !== t.hex.toLowerCase())
    .map((t) => `--color-${t.key}:${palette[t.key]}`);
  return vars.length ? `:root{${vars.join(";")}}` : "";
}

type ImageGroup = { image?: number | Media | null; variants?: unknown } | null | undefined;

export function imageFrame<T extends ResponsiveVariant | FixedVariant = ResponsiveVariant>(
  group: ImageGroup,
  key: string,
): T | null {
  const variants = group?.variants as ImageVariants | null | undefined;
  return (variants?.frames?.[key] as T | undefined) ?? null;
}

export function imageAlt(group: ImageGroup, locale: Locale): string {
  const media = group?.image;
  if (!media || typeof media === "number") return "";
  return media.alt?.[locale] ?? "";
}

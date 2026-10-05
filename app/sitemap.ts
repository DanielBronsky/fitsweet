import type { MetadataRoute } from "next";
import { defaultLocale, locales, localeTags } from "@/lib/i18n";
import { getCms } from "@/lib/cms";
import { siteConfig } from "@/lib/site";

async function lastModified(): Promise<Date> {
  try {
    const payload = await getCms();
    const [seo, theme] = await Promise.all([
      payload.findGlobal({ slug: "seo", depth: 0 }),
      payload.findGlobal({ slug: "theme", depth: 0 }),
    ]);
    const dates = [seo.updatedAt, theme.updatedAt].filter(Boolean).map((d) => new Date(d!).getTime());
    return dates.length ? new Date(Math.max(...dates)) : new Date();
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const modified = await lastModified();
  const languages = {
    ...Object.fromEntries(locales.map((l) => [localeTags[l], `${siteConfig.url}/${l}`])),
    "x-default": `${siteConfig.url}/${defaultLocale}`,
  };

  return locales.map((l) => ({
    url: `${siteConfig.url}/${l}`,
    lastModified: modified,
    changeFrequency: "weekly",
    priority: l === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}

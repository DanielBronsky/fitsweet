import { cache } from "react";
import { colorToCss } from "@/cms/palette";
import { instagramPostUrl, type InstagramKind } from "@/cms/instagram";
import type { PictureData } from "@/components/ui/ResponsivePicture";
import { getCms, imageAlt, imageFrame } from "./cms";
import { sectionTitle, type SectionTitleData } from "./catalog";
import { getDictionary, type Locale } from "./i18n";
import { siteConfig } from "./site";

export type InstagramTile = { id: string; code: string; kind: InstagramKind; url: string; picture: PictureData | null; staticSrc?: string };

export type InstagramData = {
  background: string;
  title: SectionTitleData;
  tiles: InstagramTile[];
  open: "modal" | "instagram";
  overlay: string;
  profile: {
    handle: string;
    url: string;
    description: string | null;
    titleColor: string;
    textColor: string;
    cta: string;
    buttonBackground: string;
    buttonColor: string;
  };
};

const css = (value: string | null | undefined, fallback: string) => colorToCss(value) ?? `var(--color-${fallback})`;

const placeholders = ["1", "2", "3", "4", "5"];

export const getInstagramData = cache(async (locale: Locale): Promise<InstagramData | null> => {
  const cms = await getCms();
  const [doc, list] = await Promise.all([
    cms.findGlobal({ slug: "instagramSection", depth: 0 }).catch(() => null),
    cms
      .find({ collection: "instagramPosts", depth: 1, limit: 100, sort: "_order", where: { show: { not_equals: false } } })
      .catch(() => null),
  ]);
  if (doc?.section?.show === false) return null;

  const d = getDictionary(locale).instagram;
  const handle = doc?.profile?.handle || siteConfig.instagram;
  const profileUrl = `https://www.instagram.com/${handle}/`;
  const count = doc?.posts?.count ?? 5;
  const seeded = Boolean(doc?.updatedAt) || (list?.totalDocs ?? 0) > 0;

  const tiles: InstagramTile[] = seeded
    ? (list?.docs ?? [])
        .filter((p) => p.code)
        .slice(0, count)
        .map((p) => {
          const kind = (p.kind === "reel" ? "reel" : "post") as InstagramKind;
          const desktop = imageFrame(p.cover, "desktop");
          return {
            id: String(p.id),
            code: p.code!,
            kind,
            url: instagramPostUrl(p.code!, kind),
            picture: desktop ? { desktop, mobile: null, alt: imageAlt(p.cover, locale) } : null,
          };
        })
    : placeholders.map((n) => ({ id: n, code: "", kind: "post" as const, url: profileUrl, picture: null, staticSrc: `/images/instagram/${n}.svg` }));

  const p = doc?.profile;
  return {
    background: css(doc?.section?.background, "cream"),
    title: sectionTitle(doc?.heading, locale, d.title),
    tiles,
    open: doc?.posts?.open === "instagram" ? "instagram" : "modal",
    overlay: css(doc?.posts?.overlay, "green-900"),
    profile: {
      handle,
      url: profileUrl,
      description: (doc ? p?.description?.[locale] : d.description) || null,
      titleColor: css(p?.titleColor, "green-900"),
      textColor: css(p?.textColor, "muted"),
      cta: p?.cta?.[locale] || d.cta,
      buttonBackground: css(p?.buttonBackground, "green-700"),
      buttonColor: css(p?.buttonColor, "cream"),
    },
  };
});

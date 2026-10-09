export type InstagramKind = "post" | "reel";

const URL_RE = /^https?:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9._]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]{5,})/;

export function parseInstagramUrl(url: string | null | undefined): { code: string; kind: InstagramKind } | null {
  const m = url?.trim().match(URL_RE);
  if (!m) return null;
  return { code: m[2], kind: m[1] === "p" ? "post" : "reel" };
}

export const instagramPostUrl = (code: string, kind: InstagramKind) =>
  `https://www.instagram.com/${kind === "reel" ? "reel" : "p"}/${code}/`;

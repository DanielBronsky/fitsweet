import type { Payload, PayloadRequest } from "payload";
import type { InstagramKind } from "./instagram-url";

export { instagramPostUrl, parseInstagramUrl, type InstagramKind } from "./instagram-url";

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"');

const meta = (html: string, prop: string) => {
  const m =
    html.match(new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]+)"`)) ??
    html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="${prop}"`));
  return m ? decode(m[1]) : null;
};

const HEADERS = { "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" };
const CDN_RE = /^https:\/\/[a-z0-9.-]+\.(cdninstagram\.com|fbcdn\.net)\//;

const unescapeJson = (s: string) =>
  s
    .replace(/\\\\\//g, "/")
    .replace(/\\\//g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&");

async function fromEmbed(code: string): Promise<{ image: string; kind: InstagramKind } | null> {
  const res = await fetch(`https://www.instagram.com/p/${code}/embed/`, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) return null;
  const html = await res.text();
  const url = html.match(/\\"display_url\\":\\"(.*?)\\"/)?.[1];
  if (!url) return null;
  const image = unescapeJson(url);
  if (!CDN_RE.test(image)) return null;
  const video = /\\"is_video\\":true/.test(html) || /\\"__typename\\":\\"GraphVideo\\"/.test(html);
  return { image, kind: video ? "reel" : "post" };
}

async function fromPreview(code: string): Promise<{ image: string; kind: InstagramKind } | null> {
  const res = await fetch(`https://www.instagram.com/p/${code}/`, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  if (!res.ok) return null;
  const html = await res.text();
  const image = meta(html, "og:image") ?? meta(html, "twitter:image");
  if (!image || !CDN_RE.test(image)) return null;
  return { image, kind: /\/(reel|tv)\//.test(meta(html, "og:url") ?? "") ? "reel" : "post" };
}

async function download(url: string): Promise<Buffer | null> {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) return null;
  const data = Buffer.from(await res.arrayBuffer());
  return data.length < 1000 || data.length > 15 * 1024 * 1024 ? null : data;
}

export async function locateInstagramMedia(code: string): Promise<{ image: string; kind: InstagramKind } | null> {
  for (const source of [fromEmbed, fromPreview]) {
    try {
      const found = await source(code);
      if (found) return found;
    } catch {}
  }
  return null;
}

export async function importInstagramCover(
  payload: Payload,
  code: string,
  req?: PayloadRequest,
): Promise<{ mediaId: number; kind: InstagramKind } | null> {
  const found = await locateInstagramMedia(code);
  if (!found) return null;
  const name = `instagram-${code}`;
  const data = await download(found.image).catch(() => null);
  if (!data) return null;
  const media = await payload.create({
    collection: "media",
    req,
    data: { alt: { ru: "Пост FitSweet в Instagram", ro: "Postare FitSweet pe Instagram" } },
    file: { data, mimetype: "image/jpeg", name: `${name}.jpg`, size: data.length },
  });
  return { mediaId: media.id, kind: found.kind };
}

import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type { Crops, CropFrame, MediaVariants, VariantSet } from "./crops";

/**
 * Исходники, загруженные в админке (их хранит Payload).
 * turbopackIgnore: путь известен только в рантайме — без подсказки Turbopack
 * трассирует весь проект и сборка идёт десятки минут.
 */
export const MEDIA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_DIR || "media");
/** Нарезанные webp/jpg; отдаются маршрутом app/media/[file] */
export const VARIANTS_DIR = path.join(MEDIA_DIR, "variants");
export const VARIANTS_URL = "/media";

/** Ширины для srcset. Больше ширины вырезанной области не растягиваем */
const WIDTHS = {
  desktop: [640, 960, 1280, 1920],
  mobile: [480, 750, 1080],
} as const;

const OG = { width: 1200, height: 630 };
const WEBP = { quality: 80, effort: 5 } as const;

/**
 * Приводим исходник к «как видит человек»: поворот по EXIF, SVG — растеризация
 * с запасом по плотности. Проценты кропа считаются от этих размеров.
 */
async function loadOriented(buffer: Buffer, mimeType?: string | null) {
  const isSvg = mimeType === "image/svg+xml";
  const { data, info } = await sharp(buffer, isSvg ? { density: 288 } : {})
    .rotate()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

export async function imageSize(buffer: Buffer, mimeType?: string | null) {
  const { width, height } = await loadOriented(buffer, mimeType);
  return { width, height };
}

function toPixels(frame: CropFrame, w: number, h: number) {
  const left = Math.round((frame.x / 100) * w);
  const top = Math.round((frame.y / 100) * h);
  return {
    left,
    top,
    width: Math.max(1, Math.min(Math.round((frame.width / 100) * w), w - left)),
    height: Math.max(1, Math.min(Math.round((frame.height / 100) * h), h - top)),
  };
}

function stemOf(filename: string) {
  return path
    .parse(filename)
    .name.toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
}

/**
 * Режет исходник по трём рамкам:
 *  - desktop / mobile → webp в нескольких ширинах (для <picture> + srcset);
 *  - og → jpg 1200×630 (webp в превью соцсетей поддерживается не везде).
 * В имя файла входит хэш рамки: поменяли кроп — новый URL, старый кэш не мешает.
 */
export async function generateVariants(
  buffer: Buffer,
  mimeType: string | null | undefined,
  filename: string,
  crops: Crops,
): Promise<MediaVariants> {
  await fs.mkdir(VARIANTS_DIR, { recursive: true });
  const img = await loadOriented(buffer, mimeType);
  const stem = stemOf(filename);

  const nameFor = (kind: string, suffix: string, frame: CropFrame) => {
    const hash = crypto
      .createHash("sha1")
      .update(`${filename}|${frame.x}|${frame.y}|${frame.width}|${frame.height}`)
      .digest("hex")
      .slice(0, 8);
    return `${stem}-${hash}-${kind}-${suffix}`;
  };

  async function responsive(kind: "desktop" | "mobile"): Promise<VariantSet> {
    const frame = crops[kind];
    const region = toPixels(frame, img.width, img.height);
    let widths: number[] = WIDTHS[kind].filter((w) => w <= region.width);
    if (widths.length === 0) widths = [region.width];

    const srcset = await Promise.all(
      widths.map(async (w) => {
        const file = nameFor(kind, `${w}.webp`, frame);
        await sharp(img.data).extract(region).resize({ width: w }).webp(WEBP).toFile(path.join(VARIANTS_DIR, file));
        return { w, src: `${VARIANTS_URL}/${file}` };
      }),
    );
    return { width: region.width, height: region.height, srcset };
  }

  async function og() {
    const frame = crops.og;
    const region = toPixels(frame, img.width, img.height);
    const file = nameFor("og", "1200x630.jpg", frame);
    await sharp(img.data)
      .extract(region)
      .resize({ ...OG, fit: "cover" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(VARIANTS_DIR, file));
    return { src: `${VARIANTS_URL}/${file}`, ...OG };
  }

  const [desktop, mobile, ogVariant] = await Promise.all([responsive("desktop"), responsive("mobile"), og()]);
  return { desktop, mobile, og: ogVariant };
}

export function variantFiles(variants: unknown): string[] {
  const v = variants as Partial<MediaVariants> | null | undefined;
  if (!v) return [];
  const urls = [
    ...(v.desktop?.srcset ?? []).map((s) => s.src),
    ...(v.mobile?.srcset ?? []).map((s) => s.src),
    ...(v.og?.src ? [v.og.src] : []),
  ];
  return urls.map((u) => path.basename(u));
}

/** Удаляет файлы, которые больше не используются (старый кроп, удалённая картинка) */
export async function removeVariantFiles(files: string[]) {
  await Promise.all(
    files.map((f) => fs.rm(path.join(VARIANTS_DIR, path.basename(f)), { force: true })),
  );
}

/**
 * Страховка от «сирот»: удаляет файлы нарезки, на которые не ссылается ни одна картинка.
 * Трогаем только файлы старше minAgeMs — чтобы не задеть параллельную загрузку.
 */
export async function sweepOrphanVariants(referenced: Set<string>, minAgeMs = 10 * 60 * 1000) {
  const files = await fs.readdir(VARIANTS_DIR).catch(() => [] as string[]);
  const now = Date.now();
  await Promise.all(
    files
      .filter((f) => !referenced.has(f))
      .map(async (f) => {
        const full = path.join(VARIANTS_DIR, f);
        const stat = await fs.stat(full).catch(() => null);
        if (stat && now - stat.mtimeMs > minAgeMs) await fs.rm(full, { force: true });
      }),
  );
}

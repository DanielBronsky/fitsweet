import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { aspectRatio, type CropRect, type Crops, type FrameSpec, type ImageVariants } from "./frames";

export const MEDIA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_DIR || "media");
export const VARIANTS_DIR = path.join(MEDIA_DIR, "variants");
export const VARIANTS_URL = "/media";

const WEBP = { quality: 80, effort: 5 } as const;

export async function loadOriented(buffer: Buffer, mimeType?: string | null) {
  const isSvg = mimeType === "image/svg+xml";
  const { data, info } = await sharp(buffer, isSvg ? { density: 288 } : {})
    .rotate()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

function toPixels(crop: CropRect, ratio: number, w: number, h: number) {
  const left = Math.min(Math.round((crop.x / 100) * w), w - 1);
  const top = Math.min(Math.round((crop.y / 100) * h), h - 1);
  let width = Math.max(1, Math.min(Math.round((crop.width / 100) * w), w - left));
  let height = Math.max(1, Math.round(width / ratio));
  if (top + height > h) {
    height = h - top;
    width = Math.max(1, Math.round(height * ratio));
  }
  return { left, top, width, height };
}

function stemOf(filename: string) {
  return (
    path
      .parse(filename)
      .name.toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image"
  );
}

async function exists(file: string) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false);
}

export async function generateImageVariants({
  buffer,
  mimeType,
  mediaId,
  filename,
  frames,
  crops,
}: {
  buffer: Buffer;
  mimeType?: string | null;
  mediaId: number;
  filename: string;
  frames: FrameSpec[];
  crops: Crops;
}): Promise<ImageVariants> {
  await fs.mkdir(VARIANTS_DIR, { recursive: true });
  const img = await loadOriented(buffer, mimeType);
  const stem = stemOf(filename);

  const result: ImageVariants = { mediaId, source: filename, frames: {} };

  await Promise.all(
    frames.map(async (spec) => {
      const ratio = aspectRatio(spec);
      const region = toPixels(crops[spec.key], ratio, img.width, img.height);
      const hash = crypto
        .createHash("sha1")
        .update(`${mediaId}|${filename}|${spec.key}|${ratio}|${region.left}|${region.top}|${region.width}|${region.height}`)
        .digest("hex")
        .slice(0, 10);
      const base = `${stem}-${hash}-${spec.key}`;

      if (spec.output.type === "fixed") {
        const { width, height } = spec.output;
        const file = `${base}-${width}x${height}.jpg`;
        const full = path.join(VARIANTS_DIR, file);
        if (!(await exists(full))) {
          await sharp(img.data)
            .extract(region)
            .resize({ width, height, fit: "cover" })
            .flatten({ background: "#ffffff" })
            .jpeg({ quality: 85, mozjpeg: true })
            .toFile(full);
        }
        result.frames[spec.key] = { type: "fixed", src: `${VARIANTS_URL}/${file}`, width, height };
        return;
      }

      let widths = spec.output.widths.filter((w) => w <= region.width);
      if (widths.length === 0) widths = [region.width];
      const srcset = await Promise.all(
        widths.map(async (w) => {
          const file = `${base}-${w}.webp`;
          const full = path.join(VARIANTS_DIR, file);
          if (!(await exists(full))) {
            await sharp(img.data).extract(region).resize({ width: w }).webp(WEBP).toFile(full);
          }
          return { w, src: `${VARIANTS_URL}/${file}` };
        }),
      );
      result.frames[spec.key] = { type: "responsive", width: region.width, height: region.height, srcset };
    }),
  );

  return result;
}

export function collectVariantFiles(value: unknown, into = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (value.startsWith(`${VARIANTS_URL}/`)) into.add(path.basename(value));
  } else if (Array.isArray(value)) {
    for (const v of value) collectVariantFiles(v, into);
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectVariantFiles(v, into);
  }
  return into;
}

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

export type LogoVariants = {
  mediaId: number;
  source: string;
  width: number;
  height: number;
  src: string;
  srcset: { density: number; src: string }[];
};

export async function generateLogoVariants({
  buffer,
  mimeType,
  mediaId,
  filename,
  height,
}: {
  buffer: Buffer;
  mimeType?: string | null;
  mediaId: number;
  filename: string;
  height: number;
}): Promise<LogoVariants> {
  const img = await loadOriented(buffer, mimeType);
  const width = Math.round((img.width / img.height) * height);

  await fs.mkdir(VARIANTS_DIR, { recursive: true });
  const hash = crypto.createHash("sha1").update(`${mediaId}|${filename}|logo|${height}`).digest("hex").slice(0, 10);

  if (mimeType === "image/svg+xml") {
    const file = `${stemOf(filename)}-${hash}-logo.svg`;
    const full = path.join(VARIANTS_DIR, file);
    if (!(await exists(full))) await fs.writeFile(full, buffer);
    return { mediaId, source: filename, width, height, src: `${VARIANTS_URL}/${file}`, srcset: [] };
  }

  const srcset = await Promise.all(
    [1, 2].map(async (density) => {
      const h = Math.min(height * density, img.height);
      const file = `${stemOf(filename)}-${hash}-logo-${h}.webp`;
      const full = path.join(VARIANTS_DIR, file);
      if (!(await exists(full))) {
        await sharp(img.data).resize({ height: h }).webp({ quality: 90, alphaQuality: 100 }).toFile(full);
      }
      return { density, src: `${VARIANTS_URL}/${file}` };
    }),
  );
  return { mediaId, source: filename, width, height, src: srcset[0].src, srcset };
}

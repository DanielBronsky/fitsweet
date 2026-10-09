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

export type IconVariants = {
  mediaId: number;
  source: string;
  background: string | null;
  icon: string;
  apple: string;
  ico: string;
};

async function iconTile(art: Buffer, size: number, scale: number, background: string | null, rounded: boolean) {
  const inner = Math.max(1, Math.round(size * scale));
  const fitted = await sharp(art)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: "lanczos3" })
    .png()
    .toBuffer();
  const r = rounded ? Math.round(size * 0.22) : 0;
  const base = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${background ?? "none"}"/></svg>`,
  );
  return sharp(base).composite([{ input: fitted, gravity: "center" }]).png({ compressionLevel: 9 }).toBuffer();
}

export function buildIco(pngs: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

export async function generateIconVariants({
  buffer,
  mimeType,
  mediaId,
  filename,
  background,
}: {
  buffer: Buffer;
  mimeType?: string | null;
  mediaId: number;
  filename: string;
  background: string | null;
}): Promise<IconVariants> {
  const { data } = await loadOriented(buffer, mimeType);
  const art = await sharp(data).trim({ threshold: 1 }).png().toBuffer().catch(() => sharp(data).png().toBuffer());
  const fill = background ? 0.78 : 1;

  await fs.mkdir(VARIANTS_DIR, { recursive: true });
  const hash = crypto.createHash("sha1").update(`${mediaId}|${filename}|icon|${background ?? ""}`).digest("hex").slice(0, 10);
  const stem = `${stemOf(filename)}-${hash}-icon`;

  const write = async (file: string, make: () => Promise<Buffer>) => {
    const full = path.join(VARIANTS_DIR, file);
    if (!(await exists(full))) await fs.writeFile(full, await make());
    return `${VARIANTS_URL}/${file}`;
  };

  const icon = await write(`${stem}-512.png`, () => iconTile(art, 512, fill, background, true));
  const apple = await write(`${stem}-180.png`, async () =>
    sharp(await iconTile(art, 180, background ? 0.7 : 0.86, background ?? "#ffffff", false))
      .flatten({ background: background ?? "#ffffff" })
      .png()
      .toBuffer(),
  );
  const ico = await write(`${stem}.ico`, async () =>
    buildIco(
      await Promise.all(
        [16, 32, 48].map(async (size) => ({
          size,
          data: await iconTile(art, size, background ? (size <= 16 ? 0.86 : 0.8) : 1, background, true),
        })),
      ),
    ),
  );

  return { mediaId, source: filename, background, icon, apple, ico };
}

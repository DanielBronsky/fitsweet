import fs from "fs/promises";
import path from "path";
import type { FieldHook, GroupField } from "payload";
import { normalizeCrops, type Crops, type FrameSpec, type ImageVariants } from "../media/frames";
import { MEDIA_DIR, generateImageVariants, generateLogoVariants, loadOriented, type LogoVariants } from "../media/generate";

type ImageValue = {
  image?: number | { id: number } | null;
  crops?: Crops | null;
  variants?: ImageVariants | null;
};

const idOf = (image: ImageValue["image"]) => (image && typeof image === "object" ? image.id : image ?? null);

const sameCrops = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

function buildVariants(frames: FrameSpec[]): FieldHook {
  return async ({ value, previousValue, req, context }) => {
    const current = (value ?? {}) as ImageValue;
    const previous = (previousValue ?? {}) as ImageValue;
    const mediaId = idOf(current.image);

    if (!mediaId) return { ...current, image: null, crops: null, variants: null };

    const media = await req.payload.findByID({ collection: "media", id: mediaId, depth: 0, req }).catch(() => null);
    if (!media?.filename) return { ...current, variants: null };

    const unchanged =
      !context.refreshImages &&
      previous.variants?.mediaId === mediaId &&
      previous.variants?.source === media.filename &&
      sameCrops(current.crops, previous.crops) &&
      frames.every((f) => previous.variants?.frames?.[f.key]);
    if (unchanged) return { ...current, image: mediaId, variants: previous.variants };

    const buffer = await fs.readFile(path.join(MEDIA_DIR, media.filename)).catch(() => null);
    if (!buffer) return { ...current, variants: null };

    const { width, height } = await loadOriented(buffer, media.mimeType);
    const fileChanged = Boolean(previous.variants?.source) && previous.variants?.source !== media.filename;
    const imageReplaced = (idOf(previous.image) !== mediaId || fileChanged) && sameCrops(current.crops, previous.crops);
    const crops = normalizeCrops(imageReplaced ? null : current.crops, frames, width, height);
    const variants = await generateImageVariants({
      buffer,
      mimeType: media.mimeType,
      mediaId,
      filename: media.filename,
      frames,
      crops,
    });

    return { ...current, image: mediaId, crops, variants };
  };
}

export function imageField({
  name,
  label,
  frames,
  required = false,
  description,
}: {
  name: string;
  label: string;
  frames: FrameSpec[];
  required?: boolean;
  description?: string;
}): GroupField {
  return {
    name,
    type: "group",
    label,
    admin: { description },
    hooks: { beforeChange: [buildVariants(frames)] },
    fields: [
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        label: "Картинка из медиатеки",
        required,
      },
      {
        name: "crops",
        type: "json",
        label: "Обрезка",
        admin: {
          components: {
            Field: {
              path: "/cms/admin/CropperField#CropperField",
              clientProps: { frames },
            },
          },
        },
      },
      {
        name: "variants",
        type: "json",
        admin: { hidden: true },
      },
    ],
  };
}

type LogoValue = { image?: number | { id: number } | null; variants?: LogoVariants | null };

function buildLogoVariants(height: number): FieldHook {
  return async ({ value, previousValue, req, context }) => {
    const current = (value ?? {}) as LogoValue;
    const previous = (previousValue ?? {}) as LogoValue;
    const mediaId = idOf(current.image);
    if (!mediaId) return { image: null, variants: null };

    const media = await req.payload.findByID({ collection: "media", id: mediaId, depth: 0, req }).catch(() => null);
    if (!media?.filename) return { image: mediaId, variants: null };

    if (
      !context.refreshImages &&
      previous.variants?.mediaId === mediaId &&
      previous.variants?.source === media.filename &&
      previous.variants?.height === height
    ) {
      return { image: mediaId, variants: previous.variants };
    }

    const buffer = await fs.readFile(path.join(MEDIA_DIR, media.filename)).catch(() => null);
    if (!buffer) return { image: mediaId, variants: null };

    const variants = await generateLogoVariants({
      buffer,
      mimeType: media.mimeType,
      mediaId,
      filename: media.filename,
      height,
    });
    return { image: mediaId, variants };
  };
}

export function logoField({
  name,
  label,
  height,
  description,
}: {
  name: string;
  label: string;
  height: number;
  description?: string;
}): GroupField {
  return {
    name,
    type: "group",
    label,
    admin: { description, hideGutter: true },
    hooks: { beforeChange: [buildLogoVariants(height)] },
    fields: [
      { name: "image", type: "upload", relationTo: "media", label: "Файл логотипа" },
      { name: "variants", type: "json", admin: { hidden: true } },
    ],
  };
}

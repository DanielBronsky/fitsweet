import fs from "fs/promises";
import path from "path";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterErrorHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  PayloadRequest,
} from "payload";
import { normalizeCrops } from "../media/crops";
import {
  MEDIA_DIR,
  generateVariants,
  imageSize,
  removeVariantFiles,
  sweepOrphanVariants,
  variantFiles,
} from "../media/generate";
import { revalidateSite } from "../hooks/revalidateSite";

/**
 * Режем картинку по рамкам кропера перед сохранением.
 * Новый файл → берём из запроса; иначе читаем исходник с диска.
 */
const buildVariants: CollectionBeforeChangeHook = async ({ data, req, originalDoc, operation }) => {
  const upload = req.file;
  const filename: string | undefined = data.filename ?? originalDoc?.filename;
  if (!filename) return data;

  const buffer = upload?.data ?? (await fs.readFile(path.join(MEDIA_DIR, filename)).catch(() => null));
  if (!buffer) return data;

  const mimeType = upload?.mimetype ?? data.mimeType ?? originalDoc?.mimeType;
  const { width, height } = await imageSize(buffer, mimeType);

  // Заменили файл, а рамки не трогали — старые проценты относятся к другой картинке,
  // режем по центру заново
  const replacedFile = operation === "update" && Boolean(upload);
  const cropsUntouched = JSON.stringify(data.crops) === JSON.stringify(originalDoc?.crops);
  const crops = normalizeCrops(replacedFile && cropsUntouched ? null : data.crops, width, height);

  const variants = await generateVariants(buffer, mimeType, filename, crops);
  // Если сохранение дальше упадёт (например, не заполнен alt) — afterError удалит эти файлы
  // (только новые — файлы с той же рамкой уже использует сохранённая версия)
  const existing = new Set(variantFiles(originalDoc?.variants));
  req.context.newVariantFiles = variantFiles(variants).filter((f) => !existing.has(f));

  return { ...data, crops, variants };
};

/** Все файлы нарезки, на которые ссылаются картинки в базе */
async function referencedVariantFiles(req: PayloadRequest) {
  const { docs } = await req.payload.find({
    collection: "media",
    depth: 0,
    limit: 0,
    pagination: false,
    select: { variants: true },
    req,
  });
  return new Set(docs.flatMap((d) => variantFiles(d.variants)));
}

// Старую нарезку удаляем только после успешного сохранения
const cleanupAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const current = new Set(variantFiles(doc.variants));
  await removeVariantFiles(variantFiles(previousDoc?.variants).filter((f) => !current.has(f)));
  await sweepOrphanVariants(await referencedVariantFiles(req));
  revalidateSite();
  return doc;
};

const cleanupAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await removeVariantFiles(variantFiles(doc.variants));
  await sweepOrphanVariants(await referencedVariantFiles(req));
  revalidateSite();
};

const cleanupAfterError: CollectionAfterErrorHook = async ({ context }) => {
  const files = context.newVariantFiles;
  if (Array.isArray(files)) await removeVariantFiles(files as string[]);
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Картинка", plural: "Медиатека" },
  admin: {
    useAsTitle: "filename",
    group: "Контент",
    description:
      "Все картинки сайта. Загружайте исходник в хорошем качестве (JPG, PNG, WebP, AVIF или SVG) — при сохранении сайт сам нарежет его в WebP под десктоп и мобилку по рамкам, которые вы выставите в кропере.",
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: MEDIA_DIR,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"],
    // Свой кропер с тремя рамками вместо встроенного
    crop: false,
    focalPoint: false,
    adminThumbnail: ({ doc }) => {
      const v = doc.variants as { mobile?: { srcset?: { src: string }[] } } | undefined;
      return v?.mobile?.srcset?.[0]?.src ?? null;
    },
  },
  hooks: {
    beforeChange: [buildVariants],
    afterChange: [cleanupAfterChange],
    afterDelete: [cleanupAfterDelete],
    afterError: [cleanupAfterError],
  },
  fields: [
    {
      name: "alt",
      type: "group",
      label: "Описание картинки (alt)",
      admin: {
        description:
          "Что изображено — для Google и незрячих посетителей. Например: «Шоколадные ПП-батончики FitSweet с орехами».",
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "ru", type: "text", label: "Русский", required: true },
            { name: "ro", type: "text", label: "Română", required: true },
          ],
        },
      ],
    },
    {
      name: "crops",
      type: "json",
      label: "Обрезка",
      admin: {
        components: {
          Field: "/cms/admin/CropperField#CropperField",
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

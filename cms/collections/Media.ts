import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeOperationHook,
  CollectionConfig,
} from "payload";
import { MEDIA_DIR } from "../media/generate";
import { refreshMediaUsages, sweepUnusedVariants } from "../media/usage";
import { revalidateSite } from "../hooks/revalidateSite";

const applyRotation: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  const data = (args as { data?: { rotate?: number | null } }).data;
  const id = (args as { id?: number | string }).id;
  if (operation !== "update" || !data) return args;
  const angle = Number(data.rotate);
  data.rotate = null;
  if (![90, 180, 270].includes(angle) || req.file || !id) return args;

  const doc = await req.payload.findByID({ collection: "media", id, depth: 0, req });
  if (!doc?.filename || doc.mimeType === "image/svg+xml") return args;

  const source = await fs.readFile(path.join(MEDIA_DIR, doc.filename));
  const image = sharp(source).rotate().rotate(angle);
  const output =
    doc.mimeType === "image/png"
      ? await image.png().toBuffer()
      : doc.mimeType === "image/webp"
        ? await image.webp({ quality: 95 }).toBuffer()
        : doc.mimeType === "image/avif"
          ? await image.avif({ quality: 80 }).toBuffer()
          : await image.jpeg({ quality: 95, mozjpeg: true }).toBuffer();

  req.file = { data: output, mimetype: doc.mimeType ?? "image/jpeg", name: doc.filename, size: output.length };
  return args;
};

const refreshOnFileReplace: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation === "update" && previousDoc?.filename && previousDoc.filename !== doc.filename) {
    await refreshMediaUsages(req.payload, doc.id, req);
    await sweepUnusedVariants(req.payload, req);
  }
  revalidateSite();
  return doc;
};

const cleanupAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  await sweepUnusedVariants(req.payload, req);
  revalidateSite();
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Картинка", plural: "Медиатека" },
  admin: {
    useAsTitle: "filename",
    group: false,
    description:
      "Все исходные картинки сайта. Загружайте в хорошем качестве — от 2000 px по ширине (JPG, PNG, WebP, AVIF или SVG). Обрезка под десктоп и мобилку делается там, где картинку ставят на сайт.",
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: MEDIA_DIR,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"],
    crop: false,
    focalPoint: false,
    imageSizes: [{ name: "thumbnail", width: 480, formatOptions: { format: "webp", options: { quality: 75 } } }],
    adminThumbnail: "thumbnail",
  },
  hooks: {
    beforeOperation: [applyRotation],
    afterChange: [refreshOnFileReplace],
    afterDelete: [cleanupAfterDelete],
  },
  fields: [
    {
      name: "rotate",
      type: "number",
      admin: { components: { Field: "/cms/admin/RotateField#RotateField" } },
    },
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
  ],
};

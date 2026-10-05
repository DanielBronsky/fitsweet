import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from "payload";
import { MEDIA_DIR } from "../media/generate";
import { refreshMediaUsages, sweepUnusedVariants } from "../media/usage";
import { revalidateSite } from "../hooks/revalidateSite";

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
    group: "Контент",
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
    afterChange: [refreshOnFileReplace],
    afterDelete: [cleanupAfterDelete],
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
  ],
};

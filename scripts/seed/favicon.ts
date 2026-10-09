import path from "path";
import type { Payload } from "payload";

export async function seedFavicon(payload: Payload) {
  const seo = await payload.findGlobal({ slug: "seo", depth: 0 });
  if (seo.favicon?.image) return;
  const media = await payload.create({
    collection: "media",
    filePath: path.resolve("public/brand/fitsweet-icon.png"),
    data: { alt: { ru: "Иконка FitSweet", ro: "Iconița FitSweet" } },
  });
  await payload.updateGlobal({
    slug: "seo",
    data: { favicon: { image: media.id, background: "#E8EFC4" } },
  });
}

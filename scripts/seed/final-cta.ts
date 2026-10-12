import path from "path";
import type { Payload } from "payload";

export async function seedFinalCta(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "finalCtaSection", depth: 0 });
  if (doc.updatedAt) return;

  const existing = await payload.find({ collection: "media", where: { filename: { like: "bars" } }, depth: 0, limit: 1 });
  const media =
    existing.docs[0] ??
    (await payload.create({
      collection: "media",
      filePath: path.resolve("public/images/hero/bars.svg"),
      data: { alt: { ru: "ПП-батончики FitSweet", ro: "Batoane FitSweet" } },
    }));

  await payload.updateGlobal({
    slug: "finalCtaSection",
    data: {
      section: { show: true, background: "olive" },
      heading: {
        text: { ru: "Готовы выбрать\nсвой любимый FitSweet?", ro: "Gata să-ți alegi\nFitSweet-ul preferat?" },
        color: "cream",
        subtitleColor: "cream",
        subtitle: { ru: "Полезное может быть невероятно вкусным.", ro: "Sănătos poate fi incredibil de gustos." },
        leaf: true,
        leafColor: "green-200",
      },
      media: { show: true, picture: { image: media.id }, opacity: 70, fade: true },
      primary: { text: { ru: "Смотреть десерты", ro: "Vezi deserturile" }, target: "catalog", background: "cream", color: "green-900" },
      secondary: { show: false, text: { ru: "Собрать коробку", ro: "Compune o cutie" }, target: "box", color: "cream" },
    },
  });
}

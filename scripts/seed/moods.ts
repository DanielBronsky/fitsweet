import path from "path";
import type { Payload } from "payload";
import { seedProductsData } from "./catalog";

const moods = [
  { slug: "chocolate", title: { ru: "Хочется шоколада", ro: "Poftă de ciocolată" } },
  { slug: "caramel", title: { ru: "Любите карамель", ro: "Vă place caramelul" } },
  { slug: "coconut", title: { ru: "Мечтаете о кокосе", ro: "Visați la cocos" } },
  { slug: "fruity", title: { ru: "Хочется чего-то лёгкого и фруктового", ro: "Poftă de ceva ușor și fructat" } },
  { slug: "nuts-berries", title: { ru: "Любите сочетание орехов и ягод", ro: "Vă place combinația de nuci și fructe de pădure" } },
];

export async function seedMoods(payload: Payload) {
  const existing = await payload.count({ collection: "moods" });
  if (existing.totalDocs === 0) {
    const moodIds: Record<string, number> = {};
    for (const m of moods) {
      const media = await payload.create({
        collection: "media",
        filePath: path.resolve("public/images/moods", `${m.slug}.svg`),
        data: { alt: { ru: m.title.ru, ro: m.title.ro } },
      });
      const doc = await payload.create({
        collection: "moods",
        data: { slug: m.slug, title: m.title, active: true, picture: { image: media.id } } as never,
      });
      moodIds[m.slug] = doc.id;
    }
    for (const p of seedProductsData) {
      const { docs } = await payload.find({ collection: "products", where: { slug: { equals: p.slug } }, depth: 0, limit: 1 });
      const ids = (p.moods as string[]).map((m) => moodIds[m]).filter(Boolean);
      if (docs[0] && ids.length) await payload.update({ collection: "products", id: docs[0].id, data: { moods: ids } as never });
    }
  }

  const section = await payload.findGlobal({ slug: "moodsSection", depth: 0 });
  if (!section.updatedAt) {
    await payload.updateGlobal({
      slug: "moodsSection",
      data: {
        section: { show: true, background: "beige" },
        heading: { text: { ru: "Выбирайте по настроению", ro: "Alege după dispoziție" }, color: "green-900", leafColor: "green-500", leaf: true },
        cards: { background: "white", activeBorder: "green-700", titleColor: "green-900", listColor: "muted", showList: true },
        more: {
          show: true,
          text: { ru: "Смотреть весь ассортимент", ro: "Vezi tot sortimentul" },
          background: "white",
          color: "green-900",
          border: "green-200",
        },
      },
    });
  }
}

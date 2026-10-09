import type { Payload } from "payload";

export async function seedProductCategories(payload: Payload) {
  const ensure = async (slug: string, data: Record<string, unknown>) => {
    const { docs } = await payload.find({ collection: "productCategories", where: { slug: { equals: slug } }, depth: 0, limit: 1 });
    if (docs[0]) {
      if (!docs[0].weightLabel?.ru) {
        await payload.update({ collection: "productCategories", id: docs[0].id, data: { weightLabel: data.weightLabel } as never });
      }
      return docs[0].id;
    }
    const doc = await payload.create({ collection: "productCategories", data: { slug, ...data } as never });
    return doc.id;
  };

  const desserts = await ensure("desserts", {
    title: { ru: "Десерты", ro: "Deserturi" },
    weightLabel: { ru: "на батончик {w} гр", ro: "per baton {w} g" },
    inBox: true,
    inMoods: true,
  });
  const bakery = await ensure("bakery", {
    title: { ru: "Выпечка", ro: "Patiserie" },
    weightLabel: { ru: "1 шт. · {w} г", ro: "1 buc. · {w} g" },
    inBox: false,
    inMoods: false,
  });

  const { docs: orphans } = await payload.find({
    collection: "products",
    where: { category: { exists: false } },
    depth: 0,
    limit: 0,
    pagination: false,
  });
  for (const p of orphans) {
    await payload.update({ collection: "products", id: p.id, data: { category: desserts } as never });
  }

  const catalog = await payload.findGlobal({ slug: "catalog", depth: 0 });
  if (catalog.updatedAt && !catalog.section?.category) {
    await payload.updateGlobal({ slug: "catalog", data: { section: { ...catalog.section, category: desserts } } as never });
  }

  return { desserts, bakery };
}

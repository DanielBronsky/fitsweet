import type { Payload } from "payload";
import { defaultSectionOrder } from "../../cms/sections";

type Row = { block: string; custom?: number };

export async function seedLayout(payload: Payload, bakeryCategory: number) {
  const readRows = async (): Promise<Row[]> => {
    const layout = await payload.findGlobal({ slug: "layout", depth: 0 });
    const rows = (layout.blocks ?? []).map((b) => ({
      block: b.block,
      custom: (typeof b.custom === "object" ? b.custom?.id : b.custom) ?? undefined,
    }));
    return rows.length ? rows : defaultSectionOrder.map((block) => ({ block }));
  };

  const { docs } = await payload.find({ collection: "customSections", where: { anchor: { equals: "bakery" } }, depth: 0, limit: 1 });
  let bakeryId = docs[0]?.id;
  const firstRun = (await payload.count({ collection: "customSections" })).totalDocs === 0;

  if (!bakeryId && firstRun) {
    const bakery = await payload.create({
      collection: "customSections",
      data: {
        show: true,
        anchor: "bakery",
        background: "white",
        heading: { text: { ru: "Наша выпечка", ro: "Patiseria noastră" }, color: "green-900", leafColor: "green-500", leaf: true, align: "center" },
        content: [
          {
            blockType: "products",
            category: bakeryCategory,
            initialCount: 8,
            moreText: { ru: "Смотреть всю выпечку", ro: "Vezi toată patiseria" },
          },
        ],
      } as never,
    });
    bakeryId = bakery.id;
  }

  let rows = await readRows();
  if (bakeryId) {
    rows = rows.filter((r) => !(r.block === "custom" && r.custom === bakeryId));
    const placedBefore = (await payload.findGlobal({ slug: "layout", depth: 0 })).blocks?.some(
      (b) => b.block === "custom" && (typeof b.custom === "object" ? b.custom?.id : b.custom) === bakeryId,
    );
    if (!placedBefore || firstRun) rows.splice(rows.findIndex((r) => r.block === "catalog") + 1, 0, { block: "custom", custom: bakeryId });
    else rows = await readRows();
  }
  await payload.updateGlobal({ slug: "layout", data: { blocks: rows } as never });
}

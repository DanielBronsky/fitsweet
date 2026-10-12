import type { Payload } from "payload";

export async function seedFooter(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "footer", depth: 0 });
  if (doc.updatedAt) return;
  await payload.updateGlobal({
    slug: "footer",
    data: {
      style: { background: "cream", divider: "green-200", color: "green-900", hover: "green-700", muted: "muted" },
      logo: { show: true },
      menu: { show: true, mode: "header" },
      contacts: {
        icons: true,
        items: [
          { type: "instagram", value: "fitsweet.md" },
          { type: "phone", value: "+373 69 543 450" },
        ],
      },
      bottom: { copyright: { ru: "© {year} FitSweet. Кишинёв.", ro: "© {year} FitSweet. Chișinău." } },
    } as never,
  });
}

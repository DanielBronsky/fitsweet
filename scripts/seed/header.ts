import type { Payload } from "payload";

export async function seedHeader(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "header", depth: 0 });
  if (doc.updatedAt) return;
  await payload.updateGlobal({
    slug: "header",
    data: {
      style: { background: "cream" },
      logo: { show: true, kind: "text", text: "FitSweet", color: "green-900" },
      tagline: { show: true, text: { ru: "ПП десерты", ro: "Deserturi sănătoase" }, color: "green-500" },
      menu: {
        show: true,
        color: "green-900",
        hoverColor: "green-700",
        items: [
          { label: { ru: "Каталог", ro: "Catalog" }, target: "catalog" },
          { label: { ru: "О FitSweet", ro: "Despre FitSweet" }, target: "about" },
          { label: { ru: "Где купить", ro: "Unde cumperi" }, target: "where" },
          { label: { ru: "Доставка", ro: "Livrare" }, target: "delivery" },
          { label: { ru: "Отзывы", ro: "Recenzii" }, target: "reviews" },
          { label: { ru: "Instagram", ro: "Instagram" }, target: "url", url: "https://instagram.com/fitsweet.md", newTab: true },
        ],
      },
      language: { show: true, color: "green-700" },
      order: {
        show: true,
        text: { ru: "Заказать", ro: "Comandă" },
        target: "order",
        background: "green-700",
        color: "cream",
      },
      cart: { show: true, color: "green-900", badge: "green-700" },
    },
  })
}

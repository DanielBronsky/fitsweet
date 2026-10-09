import type { Payload } from "payload";

export async function seedBox(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "boxSection", depth: 0 });
  if (doc.updatedAt) return;

  await payload.updateGlobal({
    slug: "boxSection",
    data: {
      section: { show: true, background: "beige" },
      heading: {
        text: { ru: "Соберите свою коробку FitSweet", ro: "Compune-ți cutia FitSweet" },
        color: "green-900",
        leafColor: "green-500",
        leaf: true,
        subtitleColor: "muted",
      },
      sizes: { options: [4, 6, 8, 12], initial: 8 },
      texts: {
        chooseQty: { ru: "Выберите количество десертов", ro: "Alege numărul de deserturi" },
        yourBox: { ru: "Ваша коробка:", ro: "Cutia ta:" },
        manualPick: { ru: "Выбрать вкусы вручную", ro: "Alege gusturile manual" },
        hideManual: { ru: "Скрыть выбор вкусов", ro: "Ascunde alegerea gusturilor" },
        total: { ru: "Итого:", ro: "Total:" },
        checkout: { ru: "Оформить заказ", ro: "Plasează comanda" },
        addMore: { ru: "Добавьте ещё {n}", ro: "Mai adaugă {n}" },
      },
      style: { panel: "white", border: "green-200", accent: "green-700", accentText: "cream", text: "green-900", muted: "muted" },
    },
  });
}

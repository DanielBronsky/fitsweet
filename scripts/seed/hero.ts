import path from "path";
import type { Payload } from "payload";

export async function seedHero(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "hero", depth: 0 });
  if (doc.updatedAt) return;
  const picture = await payload.create({
    collection: "media",
    filePath: path.resolve("public/images/hero/bars.svg"),
    data: {
      alt: { ru: "Ассортимент ПП-батончиков FitSweet", ro: "Sortimentul de batoane sănătoase FitSweet" },
    },
  })

  await payload.updateGlobal({
    slug: "hero",
    data: {
      section: { show: true, background: "cream" },
      heading: {
        lines: [
          { text: { ru: "Десерты,", ro: "Deserturi," }, color: "green-900" },
          { text: { ru: "которые хочется", ro: "pe care vrei" }, color: "green-500" },
          { text: { ru: "есть каждый день", ro: "să le mănânci zilnic" }, color: "green-500" },
        ],
        size: "100",
      },
      subtitle: {
        show: true,
        text: {
          ru: "ПП-десерты без сахара, лактозы и глютена — вкусное удовольствие без компромиссов.",
          ro: "Deserturi sănătoase fără zahăr, lactoză și gluten — plăcere gustoasă fără compromisuri.",
        },
        color: "muted",
      },
      buttons: {
        items: [
          {
            text: { ru: "Смотреть десерты", ro: "Vezi deserturile" },
            target: "catalog",
            background: "green-700",
            color: "cream",
          },
          {
            text: { ru: "Заказать", ro: "Comandă" },
            target: "order",
            background: "white",
            color: "green-900",
            border: "green-200",
          },
        ],
      },
      media: {
        show: true,
        picture: { image: picture.id },
        background: "sage",
        stampShow: true,
        stampText: "FIT & SWEET · GUILT-FREE ·",
        stampColor: "green-700",
      },
      features: {
        show: true,
        items: [
          { text: { ru: "Без сахара", ro: "Fără zahăr" }, icon: "no-sugar" },
          { text: { ru: "Без лактозы", ro: "Fără lactoză" }, icon: "no-lactose" },
          { text: { ru: "Без глютена", ro: "Fără gluten" }, icon: "no-gluten" },
          { text: { ru: "Вкусно и сытно", ro: "Gustos și sățios" }, icon: "tasty" },
        ],
        iconColor: "green-700",
        color: "green-900",
      },
    },
  })
}

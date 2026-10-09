import path from "path";
import type { Payload } from "payload";

export async function seedDelivery(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "deliverySection", depth: 0 });
  if (doc.updatedAt) return;
  const picture = await payload.create({
    collection: "media",
    filePath: path.resolve("public/images/delivery/box.svg"),
    data: { alt: { ru: "Подарочная коробка FitSweet с десертами", ro: "Cutie cadou FitSweet cu deserturi" } },
  })

  await payload.updateGlobal({
    slug: "deliverySection",
    data: {
      section: { show: true, background: "beige" },
      pricing: { price: 40, freeFrom: 300 },
      heading: {
        text: { ru: "FitSweet приезжает к вам", ro: "FitSweet vine la tine" },
        color: "green-900",
        leafColor: "green-500",
        leaf: true,
        subtitle: {
          ru: "Закажите любимые десерты с доставкой прямо домой или в офис.",
          ro: "Comandă deserturile preferate cu livrare acasă sau la birou.",
        },
        subtitleColor: "muted",
      },
      media: { show: true, picture: { image: picture.id }, background: "cream", side: "left" },
      steps: {
        show: true,
        items: [
          { text: { ru: "Вы выбираете десерты", ro: "Alegi deserturile" } },
          { text: { ru: "Оформляете заказ", ro: "Plasezi comanda" } },
          { text: { ru: "Мы подтверждаем заказ", ro: "Confirmăm comanda" } },
          { text: { ru: "Доставляем по вашему адресу", ro: "Livrăm la adresa ta" } },
        ],
        numberColor: "green-500",
        color: "green-900",
      },
      terms: {
        show: true,
        items: [
          { title: { ru: "Доставка по Кишинёву", ro: "Livrare în Chișinău" }, value: { ru: "от {price} MDL", ro: "de la {price} MDL" } },
          { title: { ru: "Бесплатная доставка", ro: "Livrare gratuită" }, value: { ru: "при заказе от {free} MDL", ro: "la comenzi peste {free} MDL" } },
          { title: { ru: "Доставка", ro: "Livrare" }, value: { ru: "ежедневно с 10:00 до 21:00", ro: "zilnic între 10:00 și 21:00" } },
          { title: { ru: "Заказы принимаем", ro: "Preluăm comenzi" }, value: { ru: "с 09:00 до 20:00", ro: "între 09:00 și 20:00" } },
        ],
        background: "white",
        titleColor: "muted",
        valueColor: "green-900",
      },
      button: {
        show: true,
        text: { ru: "Заказать доставку", ro: "Comandă livrare" },
        target: "order",
        background: "green-700",
        color: "cream",
      },
    },
  })
}

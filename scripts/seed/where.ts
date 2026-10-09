import type { Payload } from "payload";

export async function seedWhere(payload: Payload) {
  const doc = await payload.findGlobal({ slug: "whereSection", depth: 0 });
  if (doc.updatedAt) return;
  const categories = [
    { slug: "cafe", title: { ru: "Кафе", ro: "Cafenele" } },
    { slug: "gym", title: { ru: "Фитнес-клубы", ro: "Cluburi fitness" } },
    { slug: "shop", title: { ru: "Магазины", ro: "Magazine" } },
    { slug: "gas", title: { ru: "Заправки", ro: "Benzinării" } },
  ]
  const catIds: Record<string, number> = {}
  for (const c of categories) {
    const doc = await payload.create({ collection: "pointCategories", data: c as never })
    catIds[c.slug] = doc.id
  }

  const points = [
    {
      "name": "Balance Café",
      "address": {
        "ru": "ул. Пушкина, 25",
        "ro": "str. Pușkin, 25"
      },
      "hours": "08:00 — 21:00",
      "category": "cafe",
      "lat": 47.0245,
      "lng": 28.8322
    },
    {
      "name": "Sport Life",
      "address": {
        "ru": "ул. Пушкина, 25",
        "ro": "str. Pușkin, 25"
      },
      "hours": "08:00 — 21:00",
      "category": "gym",
      "lat": 47.0281,
      "lng": 28.8401
    },
    {
      "name": "Green Hills Market",
      "address": {
        "ru": "ул. Дачибева, 99",
        "ro": "str. Dacia, 99"
      },
      "hours": "08:00 — 22:00",
      "category": "shop",
      "lat": 47.0196,
      "lng": 28.8265
    },
    {
      "name": "Rompetrol",
      "address": {
        "ru": "ул. Московская, 14/1",
        "ro": "bd. Moscova, 14/1"
      },
      "hours": null,
      "category": "gas",
      "lat": 47.0512,
      "lng": 28.8598
    },
    {
      "name": "Coffee Molka",
      "address": {
        "ru": "бул. Штефан чел Маре, 132",
        "ro": "bd. Ștefan cel Mare, 132"
      },
      "hours": "07:30 — 22:00",
      "category": "cafe",
      "lat": 47.0231,
      "lng": 28.8367
    },
    {
      "name": "World Class",
      "address": {
        "ru": "ул. Мичурина, 8",
        "ro": "str. Miciurin, 8"
      },
      "hours": "06:00 — 23:00",
      "category": "gym",
      "lat": 47.0344,
      "lng": 28.8189
    },
    {
      "name": "Linella",
      "address": {
        "ru": "ул. Индепенденцей, 6/2",
        "ro": "str. Independenței, 6/2"
      },
      "hours": "08:00 — 23:00",
      "category": "shop",
      "lat": 47.0157,
      "lng": 28.8721
    },
    {
      "name": "Petrom",
      "address": {
        "ru": "ул. Каля Ешилор, 51",
        "ro": "str. Calea Ieșilor, 51"
      },
      "hours": null,
      "category": "gas",
      "lat": 47.0402,
      "lng": 28.7936
    }
  ]
  for (const p of points) {
    const { category, hours, ...rest } = p
    await payload.create({
      collection: "salePoints",
      data: { ...rest, allDay: hours === null, hours: hours ?? undefined, category: catIds[category], active: true } as never,
    })
  }

  await payload.updateGlobal({
    slug: "whereSection",
    data: {
      section: { show: true, background: "beige" },
      heading: {
        text: { ru: "Где купить FitSweet?", ro: "Unde cumperi FitSweet?" },
        color: "green-900",
        leafColor: "green-500",
        leaf: true,
        subtitle: {
          ru: "Наши десерты уже представлены в партнёрских локациях по городу.",
          ro: "Deserturile noastre sunt deja disponibile în locațiile partenere din oraș.",
        },
        subtitleColor: "muted",
      },
      list: {
        allLabel: { ru: "Все", ro: "Toate" },
        chipActive: "green-700",
        chipBorder: "green-200",
        cardBackground: "white",
        cardActive: "green-700",
        nameColor: "green-900",
        infoColor: "muted",
        pinColor: "green-700",
        allDay: { ru: "круглосуточно", ro: "non-stop" },
        empty: {
          ru: "В этой категории пока нет точек — скоро появятся.",
          ro: "În această categorie încă nu sunt puncte — vor apărea în curând.",
        },
      },
      more: {
        initialCount: 4,
        showAll: { ru: "Показать все локации ({n})", ro: "Arată toate locațiile ({n})" },
        collapse: { ru: "Свернуть список", ro: "Restrânge lista" },
        background: "green-700",
        color: "cream",
      },
      map: { show: true },
    },
  })
}

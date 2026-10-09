import path from "path";
import type { Payload } from "payload";

export const seedProductsData = [
    {
      "slug": "snickers-peanut",
      "name": {
        "ru": "Сникерс с арахисом",
        "ro": "Snickers cu arahide"
      },
      "price": 55,
      "weight": 55,
      "kcal": 212,
      "protein": 7.4,
      "fat": 14.8,
      "carbs": 13.6,
      "ingredients": {
        "ru": "тофу, арахисовая паста, арахис, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
        "ro": "tofu, pastă de arahide, arahide, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "snickers-peanut.svg"
    },
    {
      "slug": "snickers-almond",
      "name": {
        "ru": "Сникерс с миндалем",
        "ro": "Snickers cu migdale"
      },
      "price": 65,
      "weight": 55,
      "kcal": 218,
      "protein": 6.8,
      "fat": 15.9,
      "carbs": 12.9,
      "ingredients": {
        "ru": "тофу, миндальная паста, миндаль, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
        "ro": "tofu, pastă de migdale, migdale, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "snickers-almond.svg"
    },
    {
      "slug": "bounty",
      "name": {
        "ru": "Баунти",
        "ro": "Bounty"
      },
      "price": 50,
      "weight": 40,
      "kcal": 176,
      "protein": 1.9,
      "fat": 13.4,
      "carbs": 11.2,
      "ingredients": {
        "ru": "кокосовая стружка, кокосовое молоко, сироп цикория, какао масло, какао порошок",
        "ro": "fulgi de cocos, lapte de cocos, sirop de cicoare, unt de cacao, pudră de cacao"
      },
      "moods": [
        "coconut"
      ],
      "imageFile": "bounty.svg"
    },
    {
      "slug": "twix",
      "name": {
        "ru": "Twix",
        "ro": "Twix"
      },
      "price": 40,
      "weight": 45,
      "kcal": 195,
      "protein": 3.2,
      "fat": 12.6,
      "carbs": 17.4,
      "ingredients": {
        "ru": "миндальная мука, кокосовый сахар, нутовая мука, сироп цикория, кокосовое масло, сухое кокосовое молоко, какао масло, какао порошок",
        "ro": "făină de migdale, zahăr de cocos, făină de năut, sirop de cicoare, ulei de cocos, lapte de cocos praf, unt de cacao, pudră de cacao"
      },
      "moods": [
        "caramel"
      ],
      "imageFile": "twix.svg"
    },
    {
      "slug": "mars",
      "name": {
        "ru": "Марс",
        "ro": "Mars"
      },
      "price": 60,
      "weight": 45,
      "kcal": 201,
      "protein": 3.8,
      "fat": 13.1,
      "carbs": 16.2,
      "ingredients": {
        "ru": "кокосовая мука, миндальная паста, сироп цикория, кокосовое масло, эритрит, миндальная мука, какао порошок, псиллиум, какао масло, кэроб",
        "ro": "făină de cocos, pastă de migdale, sirop de cicoare, ulei de cocos, eritritol, făină de migdale, pudră de cacao, psyllium, unt de cacao, carob"
      },
      "moods": [
        "chocolate"
      ],
      "imageFile": "mars.svg"
    },
    {
      "slug": "iriska-pistachio-raspberry",
      "name": {
        "ru": "Ириска с фисташкой и малиной",
        "ro": "Caramea cu fistic și zmeură"
      },
      "shortName": {
        "ru": "Ириска",
        "ro": "Caramea"
      },
      "price": 35,
      "weight": 35,
      "kcal": 168,
      "protein": 2.6,
      "fat": 12.9,
      "carbs": 10.4,
      "ingredients": {
        "ru": "кокосовый сахар, какао масло, какао порошок, сироп цикория, кокосовое масло, кокосовое молоко, фисташка, сублимированная малина, соль, кэроб",
        "ro": "zahăr de cocos, unt de cacao, pudră de cacao, sirop de cicoare, ulei de cocos, lapte de cocos, fistic, zmeură liofilizată, sare, carob"
      },
      "moods": [
        "caramel"
      ],
      "imageFile": "iriska.svg"
    },
    {
      "slug": "mango-raspberry",
      "name": {
        "ru": "Манго-малина",
        "ro": "Mango-zmeură"
      },
      "price": 60,
      "weight": 40,
      "kcal": 152,
      "protein": 1.4,
      "fat": 9.8,
      "carbs": 14.1,
      "ingredients": {
        "ru": "манго, эритрит, сухое кокосовое молоко, инулин, кокосовое масло, малина, агар, какао масло, какао порошок, сироп цикория, кэроб",
        "ro": "mango, eritritol, lapte de cocos praf, inulină, ulei de cocos, zmeură, agar, unt de cacao, pudră de cacao, sirop de cicoare, carob"
      },
      "moods": [
        "fruity"
      ],
      "imageFile": "mango-raspberry.svg"
    },
    {
      "slug": "almond-cranberry",
      "name": {
        "ru": "Миндаль-клюква",
        "ro": "Migdale-merișoare"
      },
      "price": 40,
      "weight": 37,
      "kcal": 183,
      "protein": 2,
      "fat": 14.5,
      "carbs": 12.5,
      "ingredients": {
        "ru": "кокосовый сахар, кокосовое масло, миндальная паста, миндаль, клюква вяленая, вода, кокосовая стружка, какао масло, какао порошок, сироп цикория",
        "ro": "zahăr de cocos, ulei de cocos, pastă de migdale, migdale, merișoare uscate, apă, fulgi de cocos, unt de cacao, pudră de cacao, sirop de cicoare"
      },
      "moods": [
        "nuts-berries"
      ],
      "imageFile": "almond-cranberry.svg"
    }
  ]

export async function seedCatalog(payload: Payload, dessertsId: number) {
  const existing = await payload.count({ collection: "products" });
  if (existing.totalDocs === 0) {
    for (const p of seedProductsData) {
      const { imageFile, ...rest } = p;
      const data: Record<string, unknown> = { ...rest };
      delete data.moods;
      const media = await payload.create({
        collection: "media",
        filePath: path.resolve("public/images/products", imageFile),
        data: { alt: { ru: `ПП-батончик FitSweet «${p.name.ru}»`, ro: `Baton sănătos FitSweet «${p.name.ro}»` } },
      });
      await payload.create({
        collection: "products",
        data: { ...data, category: dessertsId, active: true, picture: { image: media.id } } as never,
      });
    }
  }

  const catalog = await payload.findGlobal({ slug: "catalog", depth: 0 });
  if (catalog.updatedAt) return;
  await payload.updateGlobal({
    slug: "catalog",
    data: {
      section: { show: true, background: "white", category: dessertsId },
      heading: { text: { ru: "Наши десерты", ro: "Deserturile noastre" }, color: "green-900", leafColor: "green-500", leaf: true },
      cards: {
        background: "card",
        nameColor: "green-900",
        infoColor: "muted",
        priceColor: "green-900",
        blendPhoto: true,
        addText: { ru: "В корзину", ro: "În coș" },
        addedText: { ru: "Добавлено ✓", ro: "Adăugat ✓" },
        buttonColor: "green-700",
        buttonActive: "green-700",
      },
      more: {
        show: true,
        initialCount: 8,
        text: { ru: "Смотреть весь ассортимент", ro: "Vezi tot sortimentul" },
        background: "white",
        color: "green-900",
        border: "green-200",
      },
    } as never,
  });
}

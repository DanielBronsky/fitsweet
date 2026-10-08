import type { Locale } from "./i18n/config";
import type { Product } from "./types";

export const fallbackProducts: Product[] = [
  {
    id: "snickers-peanut",
    name: { ru: "Сникерс с арахисом", ro: "Snickers cu arahide" },
    price: 55,
    weight: 55,
    kbju: { kcal: 212, protein: 7.4, fat: 14.8, carbs: 13.6 },
    moods: ["chocolate"],
    ingredients: {
      ru: "тофу, арахисовая паста, арахис, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
      ro: "tofu, pastă de arahide, arahide, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare",
    },
    image: "/images/products/snickers-peanut.svg",
  },
  {
    id: "snickers-almond",
    name: { ru: "Сникерс с миндалем", ro: "Snickers cu migdale" },
    price: 65,
    weight: 55,
    kbju: { kcal: 218, protein: 6.8, fat: 15.9, carbs: 12.9 },
    moods: ["chocolate"],
    ingredients: {
      ru: "тофу, миндальная паста, миндаль, кокосовый сахар, эритрит, кокосовое масло, псиллиум, вода, какао масло, какао порошок, сироп цикория",
      ro: "tofu, pastă de migdale, migdale, zahăr de cocos, eritritol, ulei de cocos, psyllium, apă, unt de cacao, pudră de cacao, sirop de cicoare",
    },
    image: "/images/products/snickers-almond.svg",
  },
  {
    id: "bounty",
    name: { ru: "Баунти", ro: "Bounty" },
    price: 50,
    weight: 40,
    kbju: { kcal: 176, protein: 1.9, fat: 13.4, carbs: 11.2 },
    moods: ["coconut"],
    ingredients: {
      ru: "кокосовая стружка, кокосовое молоко, сироп цикория, какао масло, какао порошок",
      ro: "fulgi de cocos, lapte de cocos, sirop de cicoare, unt de cacao, pudră de cacao",
    },
    image: "/images/products/bounty.svg",
  },
  {
    id: "twix",
    name: { ru: "Twix", ro: "Twix" },
    price: 40,
    weight: 45,
    kbju: { kcal: 195, protein: 3.2, fat: 12.6, carbs: 17.4 },
    moods: ["caramel"],
    ingredients: {
      ru: "миндальная мука, кокосовый сахар, нутовая мука, сироп цикория, кокосовое масло, сухое кокосовое молоко, какао масло, какао порошок",
      ro: "făină de migdale, zahăr de cocos, făină de năut, sirop de cicoare, ulei de cocos, lapte de cocos praf, unt de cacao, pudră de cacao",
    },
    image: "/images/products/twix.svg",
  },
  {
    id: "mars",
    name: { ru: "Марс", ro: "Mars" },
    price: 60,
    weight: 45,
    kbju: { kcal: 201, protein: 3.8, fat: 13.1, carbs: 16.2 },
    moods: ["chocolate"],
    ingredients: {
      ru: "кокосовая мука, миндальная паста, сироп цикория, кокосовое масло, эритрит, миндальная мука, какао порошок, псиллиум, какао масло, кэроб",
      ro: "făină de cocos, pastă de migdale, sirop de cicoare, ulei de cocos, eritritol, făină de migdale, pudră de cacao, psyllium, unt de cacao, carob",
    },
    image: "/images/products/mars.svg",
  },
  {
    id: "iriska-pistachio-raspberry",
    name: { ru: "Ириска с фисташкой и малиной", ro: "Caramea cu fistic și zmeură" },
    shortName: { ru: "Ириска", ro: "Caramea" },
    price: 35,
    weight: 35,
    kbju: { kcal: 168, protein: 2.6, fat: 12.9, carbs: 10.4 },
    moods: ["caramel"],
    ingredients: {
      ru: "кокосовый сахар, какао масло, какао порошок, сироп цикория, кокосовое масло, кокосовое молоко, фисташка, сублимированная малина, соль, кэроб",
      ro: "zahăr de cocos, unt de cacao, pudră de cacao, sirop de cicoare, ulei de cocos, lapte de cocos, fistic, zmeură liofilizată, sare, carob",
    },
    image: "/images/products/iriska.svg",
  },
  {
    id: "mango-raspberry",
    name: { ru: "Манго-малина", ro: "Mango-zmeură" },
    price: 60,
    weight: 40,
    kbju: { kcal: 152, protein: 1.4, fat: 9.8, carbs: 14.1 },
    moods: ["fruity"],
    ingredients: {
      ru: "манго, эритрит, сухое кокосовое молоко, инулин, кокосовое масло, малина, агар, какао масло, какао порошок, сироп цикория, кэроб",
      ro: "mango, eritritol, lapte de cocos praf, inulină, ulei de cocos, zmeură, agar, unt de cacao, pudră de cacao, sirop de cicoare, carob",
    },
    image: "/images/products/mango-raspberry.svg",
  },
  {
    id: "almond-cranberry",
    name: { ru: "Миндаль-клюква", ro: "Migdale-merișoare" },
    price: 40,
    weight: 37,
    kbju: { kcal: 183, protein: 2, fat: 14.5, carbs: 12.5 },
    moods: ["nuts-berries"],
    ingredients: {
      ru: "кокосовый сахар, кокосовое масло, миндальная паста, миндаль, клюква вяленая, вода, кокосовая стружка, какао масло, какао порошок, сироп цикория",
      ro: "zahăr de cocos, ulei de cocos, pastă de migdale, migdale, merișoare uscate, apă, fulgi de cocos, unt de cacao, pudră de cacao, sirop de cicoare",
    },
    image: "/images/products/almond-cranberry.svg",
  },
];

export const productName = (p: Product, locale: Locale) => p.name[locale];

export const tileName = (p: Product, locale: Locale) =>
  (p.shortName ?? p.name)[locale];

export const kbjuNumbers = (p: Product) =>
  `${p.kbju.kcal}/${p.kbju.protein}/${p.kbju.fat}/${p.kbju.carbs}`;

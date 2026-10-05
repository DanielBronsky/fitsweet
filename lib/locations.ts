import type { LocationCategory, SalePoint } from "./types";

export const locationCategoryKeys: (LocationCategory | "all")[] = [
  "all",
  "cafe",
  "gym",
  "shop",
  "gas",
];

export const salePoints: SalePoint[] = [
  {
    id: "1",
    name: "Balance Café",
    address: { ru: "ул. Пушкина, 25", ro: "str. Pușkin, 25" },
    hours: "08:00 — 21:00",
    category: "cafe",
    coords: [47.0245, 28.8322],
  },
  {
    id: "2",
    name: "Sport Life",
    address: { ru: "ул. Пушкина, 25", ro: "str. Pușkin, 25" },
    hours: "08:00 — 21:00",
    category: "gym",
    coords: [47.0281, 28.8401],
  },
  {
    id: "3",
    name: "Green Hills Market",
    address: { ru: "ул. Дачибева, 99", ro: "str. Dacia, 99" },
    hours: "08:00 — 22:00",
    category: "shop",
    coords: [47.0196, 28.8265],
  },
  {
    id: "4",
    name: "Rompetrol",
    address: { ru: "ул. Московская, 14/1", ro: "bd. Moscova, 14/1" },
    hours: null,
    category: "gas",
    coords: [47.0512, 28.8598],
  },
  {
    id: "5",
    name: "Coffee Molka",
    address: {
      ru: "бул. Штефан чел Маре, 132",
      ro: "bd. Ștefan cel Mare, 132",
    },
    hours: "07:30 — 22:00",
    category: "cafe",
    coords: [47.0231, 28.8367],
  },
  {
    id: "6",
    name: "World Class",
    address: { ru: "ул. Мичурина, 8", ro: "str. Miciurin, 8" },
    hours: "06:00 — 23:00",
    category: "gym",
    coords: [47.0344, 28.8189],
  },
  {
    id: "7",
    name: "Linella",
    address: { ru: "ул. Индепенденцей, 6/2", ro: "str. Independenței, 6/2" },
    hours: "08:00 — 23:00",
    category: "shop",
    coords: [47.0157, 28.8721],
  },
  {
    id: "8",
    name: "Petrom",
    address: { ru: "ул. Каля Ешилор, 51", ro: "str. Calea Ieșilor, 51" },
    hours: null,
    category: "gas",
    coords: [47.0402, 28.7936],
  },
];

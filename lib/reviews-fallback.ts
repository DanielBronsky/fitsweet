import type { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "1",
    name: { ru: "Анна", ro: "Ana" },
    text: {
      ru: "Заказываю коробку каждую неделю. «Сникерс с миндалем» — лучшее, что я пробовала из ПП-десертов.",
      ro: "Comand o cutie în fiecare săptămână. „Snickers cu migdale” este cel mai bun desert sănătos pe care l-am încercat.",
    },
    productId: "snickers-almond",
  },
  {
    id: "2",
    name: { ru: "Виктор", ro: "Victor" },
    text: {
      ru: "Беру после тренировки вместо обычных батончиков. Состав чистый, вкус не отличить от оригинала.",
      ro: "Îl iau după antrenament în locul batoanelor obișnuite. Ingrediente curate, iar gustul nu se deosebește de original.",
    },
    productId: "mars",
  },
  {
    id: "3",
    name: { ru: "Мария", ro: "Maria" },
    text: {
      ru: "У сына непереносимость лактозы — наконец нашли сладкое, которое ему можно. Доставили за час.",
      ro: "Fiul meu are intoleranță la lactoză — în sfârșit am găsit dulciuri potrivite pentru el. Au livrat într-o oră.",
    },
    productId: "bounty",
  },
];

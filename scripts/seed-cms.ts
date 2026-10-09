import { getPayload } from "payload";
import config from "@payload-config";
import { ru } from "../lib/i18n/ru";
import { ro } from "../lib/i18n/ro";
import { paletteTokens } from "../cms/palette";
import { seedHeader } from "./seed/header";
import { seedHero } from "./seed/hero";
import { seedProductCategories } from "./seed/categories";
import { seedCatalog } from "./seed/catalog";
import { seedMoods } from "./seed/moods";
import { seedWhere } from "./seed/where";
import { seedDelivery } from "./seed/delivery";
import { seedBox } from "./seed/box";
import { seedLayout } from "./seed/layout";

const payload = await getPayload({ config });
const step = async (name: string, fn: () => Promise<unknown>) => {
  await fn();
  payload.logger.info(`seed: ${name} — готово`);
};

await step("SEO", async () => {
  const seo = await payload.findGlobal({ slug: "seo", depth: 0 });
  if (seo.title?.ru && seo.title?.ro) return;
  await payload.updateGlobal({
    slug: "seo",
    data: {
      title: { ru: seo.title?.ru || ru.meta.title, ro: seo.title?.ro || ro.meta.title },
      description: { ru: seo.description?.ru || ru.meta.description, ro: seo.description?.ro || ro.meta.description },
      keywords: {
        ru: seo.keywords?.ru || ru.meta.keywords.join(", "),
        ro: seo.keywords?.ro || ro.meta.keywords.join(", "),
      },
    },
  });
});

await step("Палитра", async () => {
  const theme = await payload.findGlobal({ slug: "theme", depth: 0 });
  if (theme.updatedAt) return;
  await payload.updateGlobal({
    slug: "theme",
    data: { colors: Object.fromEntries(paletteTokens.map((t) => [t.key.replace("-", "_"), t.hex])) as never },
  });
});

await step("Шапка", () => seedHeader(payload));
await step("Баннер", () => seedHero(payload));
const { desserts, bakery } = await seedProductCategories(payload);
payload.logger.info("seed: Категории товаров — готово");
await step("Товары и «Наши десерты»", () => seedCatalog(payload, desserts));
await step("Настроения", () => seedMoods(payload));
await step("Где купить", () => seedWhere(payload));
await step("Доставка", () => seedDelivery(payload));
await step("Соберите коробку", () => seedBox(payload));
await step("Порядок блоков", () => seedLayout(payload, bakery));

process.exit(0);

/**
 * Первичное наполнение админки текущими данными сайта.
 * Запуск: pnpm seed
 * Заполняет только пустое — правки, сделанные в админке, не затирает.
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { ru } from "../lib/i18n/ru";
import { ro } from "../lib/i18n/ro";
import { paletteTokens } from "../cms/palette";

const payload = await getPayload({ config });

// SEO — из словарей сайта
for (const [locale, dict] of [
  ["ru", ru],
  ["ro", ro],
] as const) {
  const current = await payload.findGlobal({ slug: "seo", locale, fallbackLocale: false, depth: 0 });
  if (current.title) {
    payload.logger.info(`SEO [${locale}] уже заполнено — пропускаю`);
    continue;
  }
  await payload.updateGlobal({
    slug: "seo",
    locale,
    data: {
      title: dict.meta.title,
      description: dict.meta.description,
      keywords: dict.meta.keywords.join(", "),
    },
  });
  payload.logger.info(`SEO [${locale}] заполнено из словаря`);
}

// Палитра — значения из дизайна
const theme = await payload.findGlobal({ slug: "theme", depth: 0 });
const colors = (theme.colors ?? {}) as Record<string, string | null | undefined>;
const missing = paletteTokens.filter((t) => !colors[t.key.replace("-", "_")]);
if (missing.length) {
  await payload.updateGlobal({
    slug: "theme",
    data: {
      colors: Object.fromEntries(
        paletteTokens.map((t) => {
          const key = t.key.replace("-", "_");
          return [key, colors[key] || t.hex];
        }),
      ) as never,
    },
  });
  payload.logger.info(`Палитра: заполнено цветов — ${missing.length}`);
} else {
  payload.logger.info("Палитра уже заполнена — пропускаю");
}

process.exit(0);

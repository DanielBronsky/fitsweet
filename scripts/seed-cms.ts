import { getPayload } from "payload";
import config from "@payload-config";
import { ru } from "../lib/i18n/ru";
import { ro } from "../lib/i18n/ro";
import { paletteTokens } from "../cms/palette";

const payload = await getPayload({ config });

const seo = await payload.findGlobal({ slug: "seo", depth: 0 });
if (seo.title?.ru && seo.title?.ro) {
  payload.logger.info("SEO уже заполнено — пропускаю");
} else {
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
  payload.logger.info("SEO заполнено из словарей");
}

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

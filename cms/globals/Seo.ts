import type { GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { imageField } from "../fields/image";
import { bilingual } from "../fields/bilingual";
import { framePresets } from "../media/frames";

export const Seo: GlobalConfig = {
  slug: "seo",
  label: "SEO",
  admin: {
    group: "Настройки",
    description:
      "Как сайт выглядит в Google и в превью ссылок (Telegram, Facebook, Viber).",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterContentChange],
  },
  fields: [
    bilingual({
      name: "title",
      label: "Заголовок страницы (title)",
      required: true,
      maxLength: 70,
      description: "Показывается в поиске и на вкладке браузера. Оптимально 50–60 символов.",
    }),
    bilingual({
      name: "description",
      label: "Описание (description)",
      multiline: true,
      required: true,
      maxLength: 200,
      description: "Текст под заголовком в поиске. Оптимально 140–160 символов.",
    }),
    bilingual({
      name: "keywords",
      label: "Ключевые слова",
      description: "Через запятую. Google их почти не учитывает, но другие поисковики — да.",
    }),
    imageField({
      name: "ogImage",
      label: "Картинка для превью ссылок",
      frames: framePresets.og,
      description: "Показывается, когда ссылку на сайт отправляют в Telegram, Facebook, Viber. Отдаётся как JPG 1200×630.",
    }),
  ],
};

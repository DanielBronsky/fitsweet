import type { GlobalConfig } from "payload";
import { revalidateAfterChange } from "../hooks/revalidateSite";

export const Seo: GlobalConfig = {
  slug: "seo",
  label: "SEO",
  admin: {
    group: "Настройки",
    description:
      "Как сайт выглядит в Google и в превью ссылок (Telegram, Facebook, Viber). Заполните на обоих языках — переключатель языка вверху.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок страницы (title)",
      localized: true,
      required: true,
      maxLength: 70,
      admin: {
        description: "Показывается в поиске и на вкладке браузера. Оптимально 50–60 символов.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание (description)",
      localized: true,
      required: true,
      maxLength: 200,
      admin: {
        description: "Текст под заголовком в поиске. Оптимально 140–160 символов.",
      },
    },
    {
      name: "keywords",
      type: "text",
      label: "Ключевые слова",
      localized: true,
      admin: {
        description: "Через запятую. Google их почти не учитывает, но другие поисковики — да.",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Картинка для превью ссылок",
      admin: {
        description:
          "Берётся рамка «Соцсети» из кропера и отдаётся как JPG 1200×630 — так превью работает везде.",
      },
    },
  ],
};

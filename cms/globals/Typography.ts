import type { GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { fontField, weightField } from "../fields/font";

export const Typography: GlobalConfig = {
  slug: "typography",
  label: "Шрифты",
  admin: {
    group: false,
    description:
      "Шрифты всего сайта. В настройках разделов у элементов можно выбрать другой шрифт или оставить «Как в оформлении».",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterContentChange],
  },
  fields: [
    fontField({
      name: "heading",
      label: "Шрифт заголовков",
      defaultValue: "inter",
      required: true,
      description: "Крупные заголовки разделов: «Десерты, которые хочется есть каждый день», «Наши десерты»…",
    }),
    weightField({ name: "headingWeight", label: "Насыщенность заголовков", defaultValue: "700", required: true }),
    fontField({
      name: "body",
      label: "Основной шрифт",
      defaultValue: "inter",
      required: true,
      description: "Меню, кнопки, описания, цены — весь обычный текст.",
    }),
    fontField({
      name: "accent",
      label: "Акцентный шрифт",
      defaultValue: "playfair",
      required: true,
      description: "Логотип текстом и цитаты в отзывах.",
    }),
    weightField({ name: "accentWeight", label: "Насыщенность акцентного шрифта", defaultValue: "400", required: true }),
  ],
};

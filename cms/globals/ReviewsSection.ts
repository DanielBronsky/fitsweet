import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField } from "../fields/font";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const ReviewsSection: GlobalConfig = {
  slug: "reviewsSection",
  label: "Что говорят о нас",
  admin: {
    group: false,
    description: "Оформление блока отзывов. Сами отзывы — в «Отзывы».",
  },
  access: { read: () => true },
  hooks: { afterChange: [afterContentChange] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "section",
          label: "Раздел",
          fields: [
            show("Показывать раздел"),
            whenShown(colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "white" })),
          ],
        },
        {
          name: "heading",
          label: "Заголовок",
          fields: [
            ...sectionTitleFields(),
            bilingual({ name: "subtitle", label: "Текст под заголовком", multiline: true, maxLength: 240 }),
            colorField({ name: "subtitleColor", label: "Цвет текста под заголовком", defaultValue: "muted" }),
          ],
        },
        {
          name: "cards",
          label: "Карточки",
          fields: [
            row([
              colorField({ name: "background", label: "Фон карточки", defaultValue: "card" }),
              colorField({ name: "quoteColor", label: "Цвет кавычки", defaultValue: "green-200" }),
            ]),
            row([
              colorField({ name: "textColor", label: "Цвет текста", defaultValue: "green-900" }),
              colorField({ name: "nameColor", label: "Цвет имени", defaultValue: "green-900" }),
            ]),
            fontField({ name: "font", label: "Шрифт текста" }),
            { name: "showProduct", type: "checkbox", label: "Показывать название десерта", defaultValue: true },
            row([
              colorField({ name: "chipBackground", label: "Фон названия десерта", defaultValue: "sage" }),
              colorField({ name: "chipColor", label: "Цвет названия десерта", defaultValue: "green-900" }),
            ]),
          ],
        },
      ],
    },
  ],
};

import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField } from "../fields/font";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const WhereSection: GlobalConfig = {
  slug: "whereSection",
  label: "Где купить",
  admin: {
    group: false,
    description: "Оформление блока. Сами точки — в «Точки продаж», фильтры — в «Категории точек».",
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
            whenShown(colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "beige" })),
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
          name: "list",
          label: "Список и фильтры",
          fields: [
            bilingual({ name: "allLabel", label: "Фильтр «Все»", required: true, maxLength: 20 }),
            row([
              colorField({ name: "chipActive", label: "Цвет выбранного фильтра", defaultValue: "green-700" }),
              colorField({ name: "chipBorder", label: "Рамка фильтров", defaultValue: "green-200" }),
            ]),
            row([
              colorField({ name: "cardBackground", label: "Фон карточки точки", defaultValue: "white" }),
              colorField({ name: "cardActive", label: "Рамка выбранной точки", defaultValue: "green-700" }),
            ]),
            row([
              colorField({ name: "nameColor", label: "Цвет названия", defaultValue: "green-900" }),
              colorField({ name: "infoColor", label: "Цвет адреса и часов", defaultValue: "muted" }),
            ]),
            colorField({ name: "pinColor", label: "Цвет иконки и меток на карте", defaultValue: "green-700" }),
            fontField({ name: "nameFont", label: "Шрифт названия" }),
            bilingual({ name: "allDay", label: "Текст «круглосуточно»", required: true, maxLength: 20 }),
            bilingual({ name: "empty", label: "Если в категории нет точек", maxLength: 120 }),
          ],
        },
        {
          name: "more",
          label: "Кнопка «Показать все»",
          fields: [
            {
              name: "initialCount",
              type: "number",
              label: "Сколько точек показывать сразу",
              defaultValue: 4,
              min: 1,
              max: 40,
              admin: { description: "Если точек больше — появится кнопка «Показать все»." },
            },
            bilingual({
              name: "showAll",
              label: "Текст «Показать все»",
              required: true,
              maxLength: 40,
              description: "{n} заменится на число точек.",
            }),
            bilingual({ name: "collapse", label: "Текст «Свернуть»", required: true, maxLength: 30 }),
            row([
              colorField({ name: "background", label: "Цвет кнопки", defaultValue: "green-700" }),
              colorField({ name: "color", label: "Цвет текста", defaultValue: "cream" }),
            ]),
          ],
        },
        {
          name: "map",
          label: "Карта",
          fields: [show("Показывать карту")],
        },
      ],
    },
  ],
};

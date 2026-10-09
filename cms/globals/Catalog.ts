import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { show, whenShown } from "../fields/visibility";
import { sectionTitleFields } from "../fields/sectionTitle";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const Catalog: GlobalConfig = {
  slug: "catalog",
  label: "Наши десерты",
  admin: {
    group: false,
    description: "Оформление блока с карточками. Сами товары — в «Товары».",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterContentChange],
  },
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
            whenShown({
              name: "category",
              type: "relationship",
              relationTo: "productCategories",
              label: "Какие товары показывать",
              admin: { description: "Категория товаров для этого блока. Пусто — все товары." },
            }),
            whenShown({
              name: "categoryProducts",
              type: "ui",
              admin: { components: { Field: "/cms/admin/CategoryProducts#CategoryProducts" } },
            }),
          ],
        },
        {
          name: "heading",
          label: "Заголовок",
          fields: sectionTitleFields(),
        },
        {
          name: "cards",
          label: "Карточки",
          fields: [
            row([
              colorField({ name: "background", label: "Фон карточки", defaultValue: "card" }),
              colorField({ name: "nameColor", label: "Цвет названия", defaultValue: "green-900" }),
            ]),
            row([
              colorField({ name: "infoColor", label: "Цвет КБЖУ и веса", defaultValue: "muted" }),
              colorField({ name: "priceColor", label: "Цвет цены", defaultValue: "green-900" }),
            ]),
            {
              name: "blendPhoto",
              type: "checkbox",
              label: "Растворять белый фон фото в цвете карточки",
              defaultValue: true,
              admin: {
                description: "Для фото товаров на белом фоне: белое становится цветом карточки, и карточка выглядит цельной. Выключите, если у фото цветной фон.",
              },
            },
            fontField({ name: "nameFont", label: "Шрифт названия" }),
            weightField({ name: "nameWeight", label: "Насыщенность названия" }),
            {
              type: "collapsible",
              label: "Кнопка «В корзину»",
              fields: [
                bilingual({ name: "addText", label: "Текст кнопки", required: true, maxLength: 20 }),
                bilingual({ name: "addedText", label: "Текст после нажатия", required: true, maxLength: 20 }),
                row([
                  colorField({ name: "buttonColor", label: "Цвет кнопки (рамка и текст)", defaultValue: "green-700" }),
                  colorField({ name: "buttonActive", label: "Цвет после нажатия", defaultValue: "green-700" }),
                ]),
              ],
            },
          ],
        },
        {
          name: "more",
          label: "Кнопка «Весь ассортимент»",
          fields: [
            show("Показывать кнопку"),
            whenShown({
              name: "initialCount",
              type: "number",
              label: "Сколько товаров показывать сразу",
              defaultValue: 8,
              min: 1,
              max: 48,
              admin: {
                description:
                  "Кнопка появляется сама: если товаров больше этого числа (раскрывает остальные) или если покупатель выбрал настроение (возвращает все десерты). Иначе её нет.",
              },
            }),
            whenShown(bilingual({ name: "text", label: "Текст кнопки", required: true, maxLength: 40 })),
            whenShown(
              row([
                colorField({ name: "background", label: "Цвет кнопки", defaultValue: "white" }),
                colorField({ name: "color", label: "Цвет текста", defaultValue: "green-900" }),
              ]),
            ),
            whenShown(colorField({ name: "border", label: "Цвет рамки", defaultValue: "green-200" })),
            whenShown(fontField({ name: "font", label: "Шрифт" })),
          ],
        },
      ],
    },
  ],
};

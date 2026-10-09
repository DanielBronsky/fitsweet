import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { imageField } from "../fields/image";
import { linkFields } from "../fields/link";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";
import { framePresets } from "../media/frames";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const DeliverySection: GlobalConfig = {
  slug: "deliverySection",
  label: "Доставка",
  admin: {
    group: false,
    description: "Блок про доставку. Здесь же — стоимость доставки, по которой считаются корзина и форма заказа.",
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
          name: "pricing",
          label: "Стоимость",
          description: "По этим числам считаются корзина и форма заказа. В текстах условий их можно подставить: {price} и {free}.",
          fields: [
            row([
              { name: "price", type: "number", label: "Доставка, MDL", required: true, defaultValue: 40, min: 0, admin: { width: "50%" } },
              {
                name: "freeFrom",
                type: "number",
                label: "Бесплатно от суммы, MDL",
                required: true,
                defaultValue: 300,
                min: 0,
                admin: { width: "50%", description: "0 — бесплатной доставки нет." },
              },
            ]),
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
          name: "media",
          label: "Картинка",
          fields: [
            show("Показывать картинку"),
            whenShown(imageField({ name: "picture", label: "Картинка", frames: framePresets.delivery })),
            whenShown(colorField({ name: "background", label: "Цвет подложки", defaultValue: "cream" })),
            whenShown({
              name: "side",
              type: "radio",
              label: "Картинка на компьютере",
              defaultValue: "left",
              options: [
                { value: "left", label: "Слева от текста" },
                { value: "right", label: "Справа от текста" },
              ],
            }),
          ],
        },
        {
          name: "steps",
          label: "Шаги",
          fields: [
            show("Показывать шаги"),
            whenShown({
              name: "items",
              type: "array",
              label: "Шаги",
              labels: { singular: "шаг", plural: "шаги" },
              maxRows: 6,
              admin: { initCollapsed: true, components: { RowLabel: "/cms/admin/TextRowLabel#TextRowLabel" } },
              fields: [bilingual({ name: "text", label: "Текст шага", required: true, maxLength: 60 })],
            }),
            whenShown(
              row([
                colorField({ name: "numberColor", label: "Цвет номеров", defaultValue: "green-500" }),
                colorField({ name: "color", label: "Цвет текста", defaultValue: "green-900" }),
              ]),
            ),
            whenShown(fontField({ name: "font", label: "Шрифт" })),
          ],
        },
        {
          name: "terms",
          label: "Условия",
          fields: [
            show("Показывать условия"),
            whenShown({
              name: "items",
              type: "array",
              label: "Плашки с условиями",
              labels: { singular: "условие", plural: "условия" },
              maxRows: 6,
              admin: {
                initCollapsed: true,
                description: "{price} и {free} заменятся на стоимость доставки и порог бесплатной доставки из вкладки «Стоимость».",
                components: { RowLabel: "/cms/admin/TermRowLabel#TermRowLabel" },
              },
              fields: [
                bilingual({ name: "title", label: "Подпись (мелко)", required: true, maxLength: 40 }),
                bilingual({ name: "value", label: "Значение (крупно)", required: true, maxLength: 60 }),
              ],
            }),
            whenShown(
              row([
                colorField({ name: "background", label: "Фон плашки", defaultValue: "white" }),
                colorField({ name: "titleColor", label: "Цвет подписи", defaultValue: "muted" }),
              ]),
            ),
            whenShown(colorField({ name: "valueColor", label: "Цвет значения", defaultValue: "green-900" })),
            whenShown(fontField({ name: "font", label: "Шрифт" })),
            whenShown(weightField({ name: "weight", label: "Насыщенность значения" })),
          ],
        },
        {
          name: "button",
          label: "Кнопка",
          fields: [
            show("Показывать кнопку"),
            whenShown(bilingual({ name: "text", label: "Текст кнопки", required: true, maxLength: 30 })),
            whenShown({ type: "collapsible", label: "Ссылка", fields: linkFields({ defaultTarget: "order" }) } as Field),
            whenShown(
              row([
                colorField({ name: "background", label: "Цвет кнопки", defaultValue: "green-700" }),
                colorField({ name: "color", label: "Цвет текста", defaultValue: "cream" }),
              ]),
            ),
            whenShown(fontField({ name: "font", label: "Шрифт" })),
          ],
        },
      ],
    },
  ],
};

import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { logoField } from "../fields/image";
import { linkFields } from "../fields/link";

const show = (label = "Показывать"): Field => ({
  name: "show",
  type: "checkbox",
  label,
  defaultValue: true,
});

const whenShown = (field: Field): Field =>
  ({
    ...field,
    admin: {
      ...("admin" in field ? field.admin : {}),
      condition: (_: unknown, sibling: { show?: boolean }) => sibling?.show !== false,
    },
  }) as Field;

export const Header: GlobalConfig = {
  slug: "header",
  label: "Шапка",
  admin: {
    group: "Разделы сайта",
    description: "Верхняя панель сайта: логотип, меню, переключатель языка, кнопка «Заказать» и корзина.",
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
          name: "style",
          label: "Фон",
          fields: [colorField({ name: "background", label: "Цвет фона шапки", defaultValue: "cream", required: true })],
        },
        {
          name: "logo",
          label: "Логотип",
          fields: [
            show("Показывать логотип"),
            whenShown({
              name: "kind",
              type: "radio",
              label: "Вид логотипа",
              defaultValue: "text",
              options: [
                { value: "text", label: "Текстом" },
                { value: "image", label: "Картинкой" },
              ],
            }),
            {
              name: "text",
              type: "text",
              label: "Текст логотипа",
              defaultValue: "FitSweet",
              admin: { condition: (_, s) => s?.show !== false && s?.kind !== "image" },
            },
            {
              ...colorField({ name: "color", label: "Цвет текста логотипа", defaultValue: "green-900" }),
              admin: {
                components: { Field: "/cms/admin/PaletteColorField#PaletteColorField" },
                condition: (_, s) => s?.show !== false && s?.kind !== "image",
              },
            },
            {
              ...fontField({ name: "font", label: "Шрифт логотипа" }),
              admin: {
                ...fontField({ name: "font", label: "" }).admin,
                condition: (_, s) => s?.show !== false && s?.kind !== "image",
              },
            },
            {
              ...weightField({ name: "weight" }),
              admin: {
                ...weightField({ name: "weight" }).admin,
                condition: (_, s) => s?.show !== false && s?.kind !== "image",
              },
            },
            {
              ...logoField({
                name: "image",
                label: "Картинка логотипа",
                height: 44,
                description: "SVG или PNG с прозрачным фоном. Высота на сайте — 44 px, ширина подстроится.",
              }),
              admin: {
                hideGutter: true,
                description: "SVG или PNG с прозрачным фоном. Высота на сайте — 44 px, ширина подстроится.",
                condition: (_, s) => s?.show !== false && s?.kind === "image",
              },
            },
          ],
        },
        {
          name: "tagline",
          label: "Подпись под логотипом",
          fields: [
            show("Показывать подпись"),
            whenShown(bilingual({ name: "text", label: "Текст подписи", maxLength: 40 })),
            whenShown(colorField({ name: "color", label: "Цвет подписи", defaultValue: "green-500" })),
            whenShown(fontField({ name: "font", label: "Шрифт подписи" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
        {
          name: "menu",
          label: "Меню",
          fields: [
            show("Показывать меню"),
            whenShown({
              name: "items",
              type: "array",
              label: "Пункты меню",
              labels: { singular: "пункт", plural: "пункты" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: "/cms/admin/MenuRowLabel#MenuRowLabel" },
              },
              fields: [bilingual({ name: "label", label: "Название", required: true, maxLength: 30 }), ...linkFields()],
            }),
            whenShown({
              type: "row",
              fields: [
                colorField({ name: "color", label: "Цвет пунктов", defaultValue: "green-900" }),
                colorField({ name: "hoverColor", label: "Цвет при наведении", defaultValue: "green-700" }),
              ],
            } as Field),
            whenShown(fontField({ name: "font", label: "Шрифт меню" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
        {
          name: "language",
          label: "Язык",
          fields: [
            show("Показывать переключатель языка"),
            whenShown(colorField({ name: "color", label: "Цвет активного языка", defaultValue: "green-700" })),
          ],
        },
        {
          name: "order",
          label: "Кнопка «Заказать»",
          fields: [
            show("Показывать кнопку"),
            whenShown(bilingual({ name: "text", label: "Текст кнопки", required: true, maxLength: 24 })),
            whenShown({ type: "collapsible", label: "Ссылка", admin: { initCollapsed: false }, fields: linkFields({ defaultTarget: "order" }) } as Field),
            whenShown({
              type: "row",
              fields: [
                colorField({ name: "background", label: "Цвет кнопки", defaultValue: "green-700" }),
                colorField({ name: "color", label: "Цвет текста", defaultValue: "cream" }),
              ],
            } as Field),
            whenShown(fontField({ name: "font", label: "Шрифт кнопки" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
        {
          name: "cart",
          label: "Корзина",
          fields: [
            show("Показывать корзину"),
            whenShown({
              type: "row",
              fields: [
                colorField({ name: "color", label: "Цвет иконки", defaultValue: "green-900" }),
                colorField({ name: "badge", label: "Цвет счётчика", defaultValue: "green-700" }),
              ],
            } as Field),
          ],
        },
      ],
    },
  ],
};

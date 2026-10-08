import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { imageField, logoField } from "../fields/image";
import { linkFields } from "../fields/link";
import { show, whenShown } from "../fields/visibility";
import { framePresets } from "../media/frames";
import { isIconKey } from "../icons";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const Hero: GlobalConfig = {
  slug: "hero",
  label: "1 · Баннер",
  admin: {
    group: "Основное содержимое · Body",
    description: "Первый экран: большой заголовок, подзаголовок, кнопки, картинка и строка преимуществ.",
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
            whenShown(colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "cream" })),
          ],
        },
        {
          name: "heading",
          label: "Заголовок",
          description: "Главный заголовок страницы (H1) — самый важный текст для Google.",
          fields: [
            {
              name: "lines",
              type: "array",
              label: "Строки заголовка",
              labels: { singular: "строка", plural: "строки" },
              minRows: 1,
              maxRows: 4,
              admin: {
                description: "Каждая строка — с новой строки на сайте и может быть своего цвета.",
                initCollapsed: true,
                components: { RowLabel: "/cms/admin/TextRowLabel#TextRowLabel" },
              },
              fields: [
                bilingual({ name: "text", label: "Текст строки", required: true, maxLength: 40 }),
                colorField({ name: "color", label: "Цвет строки", defaultValue: "green-900" }),
              ],
            },
            fontField({ name: "font", label: "Шрифт заголовка" }),
            row([
              weightField({ name: "weight" }),
              {
                name: "size",
                type: "select",
                label: "Размер",
                defaultValue: "100",
                options: [
                  { value: "70", label: "Очень маленький (70%)" },
                  { value: "85", label: "Маленький (85%)" },
                  { value: "100", label: "Обычный (100%)" },
                  { value: "115", label: "Большой (115%)" },
                  { value: "130", label: "Очень большой (130%)" },
                ],
                admin: {
                  description: "Если строка не помещается в ширину, сайт сам немного уменьшит заголовок.",
                },
              },
            ]),
          ],
        },
        {
          name: "subtitle",
          label: "Подзаголовок",
          fields: [
            show("Показывать подзаголовок"),
            whenShown(bilingual({ name: "text", label: "Текст", multiline: true, required: true, maxLength: 240 })),
            whenShown(colorField({ name: "color", label: "Цвет текста", defaultValue: "muted" })),
            whenShown(fontField({ name: "font", label: "Шрифт" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
        {
          name: "buttons",
          label: "Кнопки",
          fields: [
            {
              name: "items",
              type: "array",
              label: "Кнопки",
              labels: { singular: "кнопка", plural: "кнопки" },
              maxRows: 3,
              admin: { initCollapsed: true, components: { RowLabel: "/cms/admin/TextRowLabel#TextRowLabel" } },
              fields: [
                bilingual({ name: "text", label: "Текст кнопки", required: true, maxLength: 28 }),
                ...linkFields({ defaultTarget: "catalog" }),
                row([
                  colorField({ name: "background", label: "Цвет кнопки", defaultValue: "green-700" }),
                  colorField({ name: "color", label: "Цвет текста", defaultValue: "cream" }),
                ]),
                colorField({ name: "border", label: "Цвет рамки" }),
                fontField({ name: "font", label: "Шрифт" }),
                weightField({ name: "weight" }),
              ],
            },
          ],
        },
        {
          name: "media",
          label: "Картинка",
          fields: [
            show("Показывать картинку"),
            whenShown(
              imageField({
                name: "picture",
                label: "Картинка",
                frames: framePresets.hero,
                description: "Справа от текста на компьютере, под текстом на телефоне. Это самая заметная картинка сайта.",
              }),
            ),
            whenShown(colorField({ name: "background", label: "Цвет подложки под картинкой", defaultValue: "sage" })),
            whenShown({
              type: "collapsible",
              label: "Печать в углу картинки",
              fields: [
                { name: "stampShow", type: "checkbox", label: "Показывать печать", defaultValue: true },
                {
                  name: "stampText",
                  type: "text",
                  label: "Текст по кругу",
                  defaultValue: "FIT & SWEET · GUILT-FREE ·",
                  maxLength: 28,
                  admin: { condition: (_, s) => s?.stampShow !== false },
                },
                {
                  ...colorField({ name: "stampColor", label: "Цвет печати", defaultValue: "green-700" }),
                  admin: {
                    components: { Field: "/cms/admin/PaletteColorField#PaletteColorField" },
                    condition: (_, s) => s?.stampShow !== false,
                  },
                },
              ],
            } as Field),
          ],
        },
        {
          name: "features",
          label: "Преимущества",
          fields: [
            show("Показывать преимущества"),
            whenShown({
              name: "items",
              type: "array",
              label: "Пункты",
              labels: { singular: "пункт", plural: "пункты" },
              maxRows: 6,
              admin: { initCollapsed: true, components: { RowLabel: "/cms/admin/FeatureRowLabel#FeatureRowLabel" } },
              fields: [
                bilingual({ name: "text", label: "Подпись", required: true, maxLength: 30 }),
                {
                  name: "icon",
                  type: "text",
                  label: "Иконка",
                  defaultValue: "tasty",
                  required: true,
                  validate: (value: string | null | undefined) => isIconKey(value) || "Выберите иконку",
                  admin: { components: { Field: "/cms/admin/IconField#IconField" } },
                },
                {
                  ...logoField({ name: "iconImage", label: "Своя иконка", height: 32 }),
                  admin: {
                    hideGutter: true,
                    description: "SVG или PNG с прозрачным фоном, примерно квадратная.",
                    condition: (_, s) => s?.icon === "custom",
                  },
                },
              ],
            }),
            whenShown(
              row([
                colorField({ name: "iconColor", label: "Цвет иконок", defaultValue: "green-700" }),
                colorField({ name: "color", label: "Цвет подписей", defaultValue: "green-900" }),
              ]),
            ),
            whenShown(fontField({ name: "font", label: "Шрифт подписей" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
      ],
    },
  ],
};

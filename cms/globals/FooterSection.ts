import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { linkFields } from "../fields/link";
import { show, whenShown } from "../fields/visibility";
import { contactTypes, validateContact } from "../contacts";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const FooterSection: GlobalConfig = {
  slug: "footer",
  label: "Футер",
  admin: {
    group: false,
    description: "Нижняя часть сайта: логотип, меню, контакты и соцсети, строка с копирайтом. Телефон и соцсети отсюда попадают и в данные для Google.",
  },
  access: { read: () => true },
  hooks: { afterChange: [afterContentChange] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "style",
          label: "Оформление",
          fields: [
            row([
              colorField({ name: "background", label: "Цвет фона", defaultValue: "cream" }),
              colorField({ name: "divider", label: "Линия над копирайтом", defaultValue: "green-200" }),
            ]),
            row([
              colorField({ name: "color", label: "Цвет ссылок и контактов", defaultValue: "green-900" }),
              colorField({ name: "hover", label: "Цвет при наведении", defaultValue: "green-700" }),
            ]),
            colorField({ name: "muted", label: "Цвет второстепенного текста", defaultValue: "muted" }),
            fontField({ name: "menuFont", label: "Шрифт меню" }),
            weightField({ name: "menuWeight", label: "Насыщенность меню" }),
            fontField({ name: "contactsFont", label: "Шрифт контактов" }),
            weightField({ name: "contactsWeight", label: "Насыщенность контактов" }),
            fontField({ name: "copyrightFont", label: "Шрифт копирайта" }),
          ],
        },
        {
          name: "logo",
          label: "Логотип",
          fields: [
            {
              ...show("Показывать логотип"),
              admin: { description: "Тот же логотип и подпись, что в шапке. Меняются в «Шапке»." },
            } as Field,
          ],
        },
        {
          name: "menu",
          label: "Меню",
          fields: [
            show("Показывать меню"),
            whenShown({
              name: "mode",
              type: "radio",
              label: "Какие пункты",
              defaultValue: "header",
              options: [
                { value: "header", label: "Как в меню шапки" },
                { value: "own", label: "Свои пункты" },
              ],
            }),
            {
              name: "items",
              type: "array",
              label: "Пункты меню футера",
              labels: { singular: "пункт", plural: "пункты" },
              admin: {
                initCollapsed: true,
                components: { RowLabel: "/cms/admin/MenuRowLabel#MenuRowLabel" },
                condition: (_, s) => s?.show !== false && s?.mode === "own",
              },
              fields: [bilingual({ name: "label", label: "Название", required: true, maxLength: 30 }), ...linkFields()],
            },
          ],
        },
        {
          name: "contacts",
          label: "Контакты и соцсети",
          fields: [
            {
              name: "items",
              type: "array",
              label: "Контакты",
              labels: { singular: "контакт", plural: "контакты" },
              admin: {
                initCollapsed: true,
                description: "Порядок — перетаскиванием. Каждый контакт показывается с иконкой и ведёт куда нужно: телефон звонит, Telegram открывает чат.",
                components: { RowLabel: "/cms/admin/ContactRowLabel#ContactRowLabel" },
              },
              fields: [
                row([
                  {
                    name: "type",
                    type: "select",
                    label: "Тип",
                    required: true,
                    defaultValue: "phone",
                    options: contactTypes.map((t) => ({ value: t.value, label: t.label })),
                    admin: { width: "35%" },
                  },
                  {
                    name: "value",
                    type: "text",
                    label: "Значение",
                    required: true,
                    validate: validateContact,
                    admin: {
                      width: "65%",
                      description: "Телефон: +373 69 000 000 · Почта: hello@fitsweet.md · Соцсети: имя аккаунта или ссылка · Адрес и часы: текст ниже.",
                    },
                  },
                ]),
                {
                  ...bilingual({
                    name: "text",
                    label: "Текст на сайте",
                    maxLength: 80,
                    description: "Для адреса и часов работы — обязательно. Для остальных можно оставить пустым: покажется значение.",
                  }),
                },
              ],
            },
            { name: "icons", type: "checkbox", label: "Показывать иконки", defaultValue: true },
          ],
        },
        {
          name: "bottom",
          label: "Нижняя строка",
          fields: [
            bilingual({
              name: "copyright",
              label: "Копирайт",
              required: true,
              maxLength: 120,
              description: "{year} заменится на текущий год.",
            }),
          ],
        },
      ],
    },
  ],
};

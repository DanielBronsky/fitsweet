import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const BoxSection: GlobalConfig = {
  slug: "boxSection",
  label: "Соберите коробку",
  admin: {
    group: false,
    description:
      "Конструктор коробки. В коробку попадают товары из категорий с галочкой «Можно класть в коробку» (Товары → Категории товаров).",
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
          name: "sizes",
          label: "Размеры коробки",
          fields: [
            {
              name: "options",
              type: "number",
              hasMany: true,
              label: "Сколько десертов можно выбрать",
              required: true,
              min: 2,
              max: 24,
              minRows: 1,
              maxRows: 6,
              defaultValue: [4, 6, 8, 12],
              admin: { description: "Каждое число — кнопка размера. Например: 4, 6, 8, 12." },
            },
            {
              name: "initial",
              type: "number",
              label: "Размер, выбранный сразу",
              required: true,
              defaultValue: 8,
              admin: { description: "Должен быть одним из чисел выше." },
              validate: (value: number | null | undefined, { siblingData }: { siblingData: { options?: number[] } }) =>
                !value || (siblingData?.options ?? []).includes(value) || "Выберите одно из чисел в списке размеров",
            },
          ],
        },
        {
          name: "texts",
          label: "Тексты",
          fields: [
            bilingual({ name: "chooseQty", label: "Над кнопками размера", required: true, maxLength: 60 }),
            bilingual({ name: "yourBox", label: "«Ваша коробка:»", required: true, maxLength: 30 }),
            row([
              bilingual({ name: "manualPick", label: "Ссылка «Выбрать вкусы вручную»", required: true, maxLength: 40 }),
              bilingual({ name: "hideManual", label: "Ссылка «Скрыть выбор вкусов»", required: true, maxLength: 40 }),
            ]),
            bilingual({ name: "total", label: "«Итого:»", required: true, maxLength: 20 }),
            bilingual({ name: "checkout", label: "Кнопка, когда коробка собрана", required: true, maxLength: 30 }),
            bilingual({
              name: "addMore",
              label: "Кнопка, пока коробка не собрана",
              required: true,
              maxLength: 30,
              description: "{n} заменится на число недостающих десертов.",
            }),
          ],
        },
        {
          name: "style",
          label: "Оформление",
          fields: [
            row([
              colorField({ name: "panel", label: "Фон панелей", defaultValue: "white" }),
              colorField({ name: "border", label: "Рамки и пустые места", defaultValue: "green-200" }),
            ]),
            row([
              colorField({ name: "accent", label: "Выбранный размер, ссылка и кнопка", defaultValue: "green-700" }),
              colorField({ name: "accentText", label: "Текст на выбранном и на кнопке", defaultValue: "cream" }),
            ]),
            row([
              colorField({ name: "text", label: "Основной текст и сумма", defaultValue: "green-900" }),
              colorField({ name: "muted", label: "Подписи", defaultValue: "muted" }),
            ]),
          ],
        },
      ],
    },
  ],
};

import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const InstagramSection: GlobalConfig = {
  slug: "instagramSection",
  label: "Больше FitSweet каждый день",
  admin: {
    group: false,
    description: "Блок Instagram. Сами посты — в «Посты Instagram».",
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
            whenShown(colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "cream" })),
          ],
        },
        {
          name: "heading",
          label: "Заголовок",
          fields: sectionTitleFields(),
        },
        {
          name: "posts",
          label: "Плитки",
          fields: [
            {
              name: "count",
              type: "number",
              label: "Сколько постов показывать",
              defaultValue: 5,
              min: 1,
              max: 100,
              admin: { description: "От 1 до 100. Берутся первые по порядку в «Посты Instagram». Больше 5 — на компьютере лента со стрелками." },
            },
            {
              name: "open",
              type: "radio",
              label: "По клику на плитку",
              defaultValue: "modal",
              options: [
                { value: "modal", label: "Открыть пост в окне на сайте (видео играет со звуком)" },
                { value: "instagram", label: "Перейти в Instagram" },
              ],
            },
            colorField({ name: "overlay", label: "Цвет затемнения при наведении", defaultValue: "green-900" }),
          ],
        },
        {
          name: "profile",
          label: "Аккаунт и кнопка",
          fields: [
            {
              name: "handle",
              type: "text",
              label: "Аккаунт Instagram",
              required: true,
              defaultValue: "fitsweet.md",
              admin: { description: "Без @ и без ссылки — только имя аккаунта." },
              validate: (value: string | null | undefined) =>
                !value || /^[A-Za-z0-9._]{1,30}$/.test(value) || "Только латиница, цифры, точка и подчёркивание",
            },
            { ...bilingual({ name: "followUs", label: "Заголовок справа", required: true, maxLength: 60 }), admin: { hidden: true } },
            bilingual({ name: "description", label: "Текст под заголовком", multiline: true, maxLength: 200 }),
            row([
              colorField({ name: "titleColor", label: "Цвет имени аккаунта", defaultValue: "green-900" }),
              colorField({ name: "textColor", label: "Цвет текста под заголовком", defaultValue: "muted" }),
            ]),
            bilingual({ name: "cta", label: "Текст кнопки", required: true, maxLength: 30 }),
            row([
              colorField({ name: "buttonBackground", label: "Цвет кнопки", defaultValue: "green-700" }),
              colorField({ name: "buttonColor", label: "Цвет текста кнопки", defaultValue: "cream" }),
            ]),
          ],
        },
      ],
    },
  ],
};

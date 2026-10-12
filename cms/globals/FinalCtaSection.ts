import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { imageField } from "../fields/image";
import { linkFields } from "../fields/link";
import { show, whenShown } from "../fields/visibility";
import { framePresets } from "../media/frames";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const FinalCtaSection: GlobalConfig = {
  slug: "finalCtaSection",
  label: "Финальный призыв",
  admin: {
    group: false,
    description: "Полоса в конце страницы: «Готовы выбрать свой любимый FitSweet?» и кнопка.",
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
            whenShown(colorField({ name: "background", label: "Цвет фона", defaultValue: "olive" })),
          ],
        },
        {
          name: "heading",
          label: "Текст",
          fields: [
            bilingual({
              name: "text",
              label: "Заголовок",
              required: true,
              multiline: true,
              maxLength: 90,
              description: "Чтобы перенести строку — нажмите Enter.",
            }),
            row([
              colorField({ name: "color", label: "Цвет заголовка", defaultValue: "cream" }),
              colorField({ name: "subtitleColor", label: "Цвет текста под заголовком", defaultValue: "cream" }),
            ]),
            fontField({ name: "font", label: "Шрифт заголовка" }),
            weightField({ name: "weight" }),
            bilingual({ name: "subtitle", label: "Текст под заголовком", maxLength: 140 }),
            fontField({ name: "subtitleFont", label: "Шрифт текста под заголовком" }),
            weightField({ name: "subtitleWeight" }),
            { name: "leaf", type: "checkbox", label: "Веточка рядом с кнопкой", defaultValue: true },
            colorField({ name: "leafColor", label: "Цвет веточки", defaultValue: "green-200" }),
          ],
        },
        {
          name: "media",
          label: "Картинка",
          fields: [
            show("Показывать картинку"),
            whenShown(imageField({ name: "picture", label: "Картинка", frames: framePresets.finalCta })),
            whenShown({
              name: "opacity",
              type: "number",
              label: "Яркость картинки, %",
              defaultValue: 70,
              min: 10,
              max: 100,
              admin: { description: "Меньше — картинка бледнее и текст читается лучше." },
            }),
            whenShown({ name: "fade", type: "checkbox", label: "Плавный переход в цвет фона под текстом", defaultValue: true }),
          ],
        },
        {
          name: "primary",
          label: "Кнопка",
          fields: [
            bilingual({ name: "text", label: "Текст кнопки", required: true, maxLength: 30 }),
            { type: "collapsible", label: "Ссылка", fields: linkFields({ defaultTarget: "catalog" }) } as Field,
            row([
              colorField({ name: "background", label: "Цвет кнопки", defaultValue: "cream" }),
              colorField({ name: "color", label: "Цвет текста", defaultValue: "green-900" }),
            ]),
            fontField({ name: "font", label: "Шрифт кнопки" }),
            weightField({ name: "weight" }),
          ],
        },
        {
          name: "secondary",
          label: "Вторая кнопка",
          fields: [
            { ...show("Показывать вторую кнопку"), defaultValue: false } as Field,
            whenShown(bilingual({ name: "text", label: "Текст кнопки", maxLength: 30 })),
            whenShown({ type: "collapsible", label: "Ссылка", fields: linkFields({ defaultTarget: "box" }) } as Field),
            whenShown(colorField({ name: "color", label: "Цвет текста и рамки", defaultValue: "cream" })),
            whenShown(fontField({ name: "font", label: "Шрифт кнопки" })),
            whenShown(weightField({ name: "weight" })),
          ],
        },
      ],
    },
  ],
};

import type { Field, GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { sectionTitleFields } from "../fields/sectionTitle";
import { show, whenShown } from "../fields/visibility";

const row = (fields: Field[]): Field => ({ type: "row", fields });

export const MoodsSection: GlobalConfig = {
  slug: "moodsSection",
  label: "Выбирайте по настроению",
  admin: {
    group: false,
    description: "Оформление блока. Сами карточки — в «Настроения».",
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
            whenShown(colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "beige" })),
          ],
        },
        { name: "heading", label: "Заголовок", fields: sectionTitleFields() },
        {
          name: "cards",
          label: "Карточки",
          fields: [
            row([
              colorField({ name: "background", label: "Фон карточки", defaultValue: "white" }),
              colorField({ name: "activeBorder", label: "Рамка выбранной карточки", defaultValue: "green-700" }),
            ]),
            row([
              colorField({ name: "titleColor", label: "Цвет текста карточки", defaultValue: "green-900" }),
              colorField({ name: "listColor", label: "Цвет списка десертов", defaultValue: "muted" }),
            ]),
            fontField({ name: "titleFont", label: "Шрифт текста карточки" }),
            weightField({ name: "titleWeight", label: "Насыщенность текста карточки" }),
            {
              name: "showList",
              type: "checkbox",
              label: "Показывать под карточкой список подходящих десертов",
              defaultValue: true,
            },
          ],
        },
        {
          name: "more",
          label: "Кнопка внизу",
          fields: [
            show("Показывать кнопку"),
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

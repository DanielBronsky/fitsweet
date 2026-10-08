import type { Field } from "payload";
import { bilingual } from "./bilingual";
import { colorField } from "./color";
import { fontField, weightField } from "./font";

export const sectionTitleFields = (): Field[] => [
  bilingual({ name: "text", label: "Текст заголовка", required: true, maxLength: 60 }),
  {
    type: "row",
    fields: [
      colorField({ name: "color", label: "Цвет заголовка", defaultValue: "green-900" }),
      colorField({ name: "leafColor", label: "Цвет веточки", defaultValue: "green-500" }),
    ],
  },
  { name: "leaf", type: "checkbox", label: "Показывать веточку справа", defaultValue: true },
  fontField({ name: "font", label: "Шрифт заголовка" }),
  weightField({ name: "weight" }),
];

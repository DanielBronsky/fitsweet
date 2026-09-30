import type { GlobalConfig } from "payload";
import { HEX_RE, paletteTokens } from "../palette";
import { revalidateAfterChange } from "../hooks/revalidateSite";

/**
 * Палитра бренда. Все цветовые поля в разделах сайта выбирают цвет отсюда —
 * поменяли HEX здесь, перекрасились все элементы с этим цветом.
 */
export const Theme: GlobalConfig = {
  slug: "theme",
  label: "Палитра",
  admin: {
    group: "Оформление",
    description:
      "Фирменные цвета сайта. В настройках разделов цвета выбираются из этого списка.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
  },
  fields: [
    {
      name: "colors",
      type: "group",
      label: "Цвета",
      fields: paletteTokens.map((t) => ({
        name: t.key.replace("-", "_"),
        type: "text" as const,
        label: t.label,
        defaultValue: t.hex,
        required: true,
        validate: (value: string | null | undefined) =>
          (value && HEX_RE.test(value)) || "HEX в формате #aabbcc",
        admin: {
          components: {
            Field: "/cms/admin/HexColorField#HexColorField",
          },
        },
      })),
    },
  ],
};

import type { TextField } from "payload";
import { HEX_RE, paletteTokens } from "../palette";

const paletteKeys = new Set<string>(paletteTokens.map((t) => t.key));

/**
 * Цвет элемента: цвет из палитры бренда или свой HEX.
 * В админке — образцы палитры + «свой цвет» (cms/admin/PaletteColorField).
 */
export function colorField({
  name,
  label,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}): TextField {
  return {
    name,
    type: "text",
    label,
    defaultValue,
    required,
    validate: (value: string | null | undefined) => {
      if (!value) return required ? "Выберите цвет" : true;
      if (paletteKeys.has(value) || HEX_RE.test(value)) return true;
      return "Цвет из палитры или HEX в формате #aabbcc";
    },
    admin: {
      components: {
        Field: "/cms/admin/PaletteColorField#PaletteColorField",
      },
    },
  };
}

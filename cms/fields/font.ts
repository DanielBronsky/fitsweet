import type { SelectField, TextField } from "payload";
import { fontWeights, isFontKey } from "../fonts";

export function fontField({
  name,
  label,
  defaultValue,
  required = false,
  description,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  description?: string;
}): TextField {
  return {
    name,
    type: "text",
    label,
    defaultValue,
    required,
    validate: (value: string | null | undefined) => {
      if (!value) return required ? "Выберите шрифт" : true;
      return isFontKey(value) || "Выберите шрифт из списка";
    },
    admin: {
      description,
      components: {
        Field: {
          path: "/cms/admin/FontField#FontField",
          clientProps: { allowInherit: !required },
        },
      },
    },
  };
}

export function weightField({
  name,
  label = "Насыщенность",
  defaultValue,
  required = false,
}: {
  name: string;
  label?: string;
  defaultValue?: string;
  required?: boolean;
}): SelectField {
  return {
    name,
    type: "select",
    label,
    defaultValue,
    required,
    options: fontWeights.map((w) => ({ value: w.value, label: `${w.label} (${w.value})` })),
    admin: {
      placeholder: "Как в оформлении",
      description: "Если у шрифта нет такой насыщенности, браузер возьмёт ближайшую.",
    },
  };
}

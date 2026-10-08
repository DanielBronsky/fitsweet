import type { Field } from "payload";

export const show = (label = "Показывать"): Field => ({
  name: "show",
  type: "checkbox",
  label,
  defaultValue: true,
});

export const whenShown = (field: Field): Field =>
  ({
    ...field,
    admin: {
      ...("admin" in field ? field.admin : {}),
      condition: (_: unknown, sibling: { show?: boolean }) => sibling?.show !== false,
    },
  }) as Field;

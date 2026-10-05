import type { Field, GroupField } from "payload";

export function bilingual({
  name,
  label,
  multiline = false,
  required = false,
  maxLength,
  description,
}: {
  name: string;
  label: string;
  multiline?: boolean;
  required?: boolean;
  maxLength?: number;
  description?: string;
}): GroupField {
  const input = (lang: "ru" | "ro", label: string): Field =>
    multiline
      ? { name: lang, type: "textarea", label, required, maxLength, admin: { width: "50%" } }
      : { name: lang, type: "text", label, required, maxLength, admin: { width: "50%" } };
  return {
    name,
    type: "group",
    label,
    admin: { description, hideGutter: true },
    fields: [
      {
        type: "row",
        fields: [
          input("ru", "Русский"),
          input("ro", "Română"),
        ],
      },
    ],
  };
}

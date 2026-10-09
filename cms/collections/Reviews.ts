import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";

const fillName: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const ru = data.author?.ru?.trim();
  const text = data.text?.ru?.trim();
  if (ru) data.name = text ? `${ru} — ${text.slice(0, 50)}${text.length > 50 ? "…" : ""}` : ru;
  return data;
};

export const Reviews: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Отзыв", plural: "Отзывы" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "product", "show"],
    description: "Отзывы на сайте. Порядок — перетаскиванием в списке.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [fillName],
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Отзыв", admin: { hidden: true } },
    { name: "show", type: "checkbox", label: "Показывать на сайте", defaultValue: true, admin: { position: "sidebar" } },
    bilingual({ name: "author", label: "Имя", required: true, maxLength: 40 }),
    bilingual({ name: "text", label: "Текст отзыва", required: true, multiline: true, maxLength: 400 }),
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      label: "О каком десерте",
      admin: { description: "Необязательно. Название показывается в углу карточки." },
    },
  ],
};

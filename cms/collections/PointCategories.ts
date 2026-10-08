import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { slugify } from "./Products";

const fillDerived: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const ru = data.title?.ru?.trim();
  if (ru) data.name = ru;
  if (!data.slug && ru) data.slug = slugify(ru);
  return data;
};

export const PointCategories: CollectionConfig = {
  slug: "pointCategories",
  labels: { singular: "Категория", plural: "Категории точек" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name"],
    description: "Фильтры над списком точек: «Кафе», «Фитнес-клубы»… Порядок — перетаскиванием.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [fillDerived],
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Название", admin: { hidden: true } },
    bilingual({ name: "title", label: "Название категории", required: true, maxLength: 30 }),
    {
      name: "slug",
      type: "text",
      label: "Код",
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Латиницей, заполняется сам." },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9-]+$/.test(value) || "Только латиница, цифры и дефис",
    },
  ],
};

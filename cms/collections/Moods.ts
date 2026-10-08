import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { imageField } from "../fields/image";
import { framePresets } from "../media/frames";
import { slugify } from "./Products";

const fillDerived: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const ru = data.title?.ru?.trim();
  if (ru) data.name = ru;
  if (!data.slug && ru) data.slug = slugify(ru);
  return data;
};

export const Moods: CollectionConfig = {
  slug: "moods",
  labels: { singular: "Настроение", plural: "Настроения" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "active"],
    description: "Карточки блока «Выбирайте по настроению». Какие десерты в каком настроении — отмечается в самих товарах. Порядок — перетаскиванием.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [fillDerived],
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Название", admin: { hidden: true } },
    bilingual({ name: "title", label: "Текст карточки", required: true, maxLength: 60 }),
    imageField({ name: "picture", label: "Картинка", frames: framePresets.moodCard }),
    {
      name: "active",
      type: "checkbox",
      label: "Показывать на сайте",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
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

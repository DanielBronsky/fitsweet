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

export const ProductCategories: CollectionConfig = {
  slug: "productCategories",
  labels: { singular: "Категория товаров", plural: "Категории товаров" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "inBox", "inMoods"],
    description: "«Десерты», «Выпечка»… У каждого товара выбирается категория. Раздел с карточками показывает товары своей категории.",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [fillDerived],
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Название", admin: { hidden: true } },
    bilingual({ name: "title", label: "Название категории", required: true, maxLength: 40 }),
    bilingual({
      name: "weightLabel",
      label: "Подпись к весу в карточке",
      maxLength: 40,
      description: "{w} заменится на вес. Например: «на батончик {w} гр» или «1 шт. · {w} г».",
    }),
    {
      name: "inBox",
      type: "checkbox",
      label: "Участвует в «Соберите коробку»",
      defaultValue: false,
      admin: { description: "Товары этой категории можно класть в коробку в конструкторе." },
    },
    {
      name: "inMoods",
      type: "checkbox",
      label: "Участвует в «Выбирайте по настроению»",
      defaultValue: false,
      admin: { description: "Товары этой категории показываются в подборках по настроению и в фильтре каталога." },
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

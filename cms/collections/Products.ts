import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { imageField } from "../fields/image";
import { framePresets } from "../media/frames";

const translit: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .split("")
    .map((c) => translit[c] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const fillDerived: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const ru = data.name?.ru?.trim();
  if (ru) data.title = ru;
  if (!data.slug && ru) data.slug = slugify(ru);
  return data;
};

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Товар", plural: "Товары" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "title",
    defaultColumns: ["title", "category", "price", "weight", "active"],
    description: "Все товары сайта: десерты, выпечка… Разделы с карточками, корзина, коробка и форма заказа берут товары отсюда. Порядок — перетаскиванием.",
    listSearchableFields: ["title", "slug"],
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
    { name: "title", type: "text", label: "Название", admin: { hidden: true } },
    bilingual({ name: "name", label: "Название", required: true, maxLength: 60 }),
    bilingual({
      name: "shortName",
      label: "Короткое название для карточки",
      maxLength: 24,
      description: "Если название длинное. Пусто — в карточке будет полное название.",
    }),
    {
      type: "row",
      fields: [
        { name: "price", type: "number", label: "Цена, MDL", required: true, min: 0, admin: { width: "33%" } },
        { name: "weight", type: "number", label: "Вес, г", required: true, min: 1, admin: { width: "33%" } },
      ],
    },
    {
      type: "collapsible",
      label: "КБЖУ на 1 штуку",
      fields: [
        {
          type: "row",
          fields: [
            { name: "kcal", type: "number", label: "Ккал", min: 0, admin: { width: "25%" } },
            { name: "protein", type: "number", label: "Белки, г", min: 0, admin: { width: "25%", step: 0.1 } },
            { name: "fat", type: "number", label: "Жиры, г", min: 0, admin: { width: "25%", step: 0.1 } },
            { name: "carbs", type: "number", label: "Углеводы, г", min: 0, admin: { width: "25%", step: 0.1 } },
          ],
        },
      ],
    },
    bilingual({ name: "ingredients", label: "Состав", multiline: true, maxLength: 600 }),
    imageField({
      name: "picture",
      label: "Фото",
      frames: framePresets.productCard,
      description: "Лучше на светлом однотонном фоне, товар по центру.",
    }),
    {
      name: "categoryFromUrl",
      type: "ui",
      admin: { position: "sidebar", components: { Field: "/cms/admin/CategoryFromUrl#CategoryFromUrl" } },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "productCategories",
      label: "Категория",
      required: true,
      admin: { position: "sidebar", description: "«Десерты», «Выпечка»… Определяет, в каком разделе показывается товар." },
    },
    {
      name: "active",
      type: "checkbox",
      label: "Показывать на сайте",
      defaultValue: true,
      admin: { position: "sidebar", description: "Снимите, если товар временно закончился." },
    },
    {
      name: "moods",
      type: "relationship",
      relationTo: "moods",
      label: "Настроения",
      hasMany: true,
      admin: { position: "sidebar", description: "В каких подборках «Выбирайте по настроению» показывать." },
    },
    {
      name: "slug",
      type: "text",
      label: "Код товара",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "Латиницей, заполняется сам. Не меняйте у товаров, которые уже продаются — на нём держатся корзины покупателей.",
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9-]+$/.test(value) || "Только латиница, цифры и дефис",
    },
  ],
};

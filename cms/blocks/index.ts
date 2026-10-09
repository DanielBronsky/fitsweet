import type { Block, Field } from "payload";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { fontField, weightField } from "../fields/font";
import { imageField } from "../fields/image";
import { linkFields } from "../fields/link";
import { framePresets } from "../media/frames";
import { isIconKey } from "../icons";

const row = (fields: Field[]): Field => ({ type: "row", fields });

const buttonGroup: Field = {
  name: "button",
  type: "group",
  label: "Кнопка",
  admin: { hideGutter: true },
  fields: [
    { name: "show", type: "checkbox", label: "Показывать кнопку", defaultValue: false },
    {
      type: "collapsible",
      label: "Текст и ссылка",
      admin: { condition: (_, s) => Boolean(s?.show) },
      fields: [
        bilingual({ name: "text", label: "Текст кнопки", maxLength: 30 }),
        ...linkFields({ defaultTarget: "order" }),
        row([
          colorField({ name: "background", label: "Цвет кнопки", defaultValue: "green-700" }),
          colorField({ name: "color", label: "Цвет текста", defaultValue: "cream" }),
        ]),
      ],
    },
  ],
};

export const ProductsBlock: Block = {
  slug: "products",
  labels: { singular: "Карточки товаров", plural: "Карточки товаров" },
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "productCategories",
      label: "Какие товары показывать",
      required: true,
      admin: { description: "Раздел показывает все товары этой категории (с галочкой «Показывать на сайте»)." },
    },
    {
      name: "categoryProducts",
      type: "ui",
      admin: { components: { Field: "/cms/admin/CategoryProducts#CategoryProducts" } },
    },
    {
      name: "initialCount",
      type: "number",
      label: "Сколько показывать сразу",
      defaultValue: 8,
      min: 1,
      max: 48,
      admin: { description: "Если товаров больше — появится кнопка «Смотреть все»." },
    },
    bilingual({ name: "moreText", label: "Текст кнопки «Смотреть все»", maxLength: 40 }),
  ],
};

export const TextImageBlock: Block = {
  slug: "textImage",
  labels: { singular: "Текст и картинка", plural: "Текст и картинка" },
  fields: [
    bilingual({
      name: "text",
      label: "Текст",
      multiline: true,
      maxLength: 2000,
      description: "Пустая строка между абзацами — новый абзац.",
    }),
    colorField({ name: "textColor", label: "Цвет текста", defaultValue: "muted" }),
    imageField({ name: "picture", label: "Картинка", frames: framePresets.delivery }),
    {
      name: "side",
      type: "radio",
      label: "Картинка на компьютере",
      defaultValue: "right",
      options: [
        { value: "left", label: "Слева от текста" },
        { value: "right", label: "Справа от текста" },
      ],
    },
    colorField({ name: "pictureBackground", label: "Цвет подложки под картинкой", defaultValue: "cream" }),
    buttonGroup,
  ],
};

export const FeaturesBlock: Block = {
  slug: "features",
  labels: { singular: "Преимущества", plural: "Преимущества" },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Карточки",
      labels: { singular: "карточка", plural: "карточки" },
      minRows: 1,
      maxRows: 12,
      admin: { initCollapsed: true, components: { RowLabel: "/cms/admin/FeatureCardRowLabel#FeatureCardRowLabel" } },
      fields: [
        {
          name: "icon",
          type: "text",
          label: "Иконка",
          defaultValue: "lucide:Leaf",
          required: true,
          validate: (value: string | null | undefined) => (value !== "custom" && isIconKey(value)) || "Выберите иконку из галереи",
          admin: { components: { Field: "/cms/admin/IconField#IconField" } },
        },
        bilingual({ name: "title", label: "Заголовок карточки", required: true, maxLength: 60 }),
        bilingual({ name: "text", label: "Текст", multiline: true, maxLength: 300 }),
      ],
    },
    {
      name: "columns",
      type: "select",
      label: "Карточек в ряд (компьютер)",
      defaultValue: "3",
      options: ["2", "3", "4"].map((v) => ({ value: v, label: v })),
    },
    row([
      colorField({ name: "cardBackground", label: "Фон карточки", defaultValue: "white" }),
      colorField({ name: "iconColor", label: "Цвет иконок", defaultValue: "green-700" }),
    ]),
    row([
      colorField({ name: "titleColor", label: "Цвет заголовков", defaultValue: "green-900" }),
      colorField({ name: "textColor", label: "Цвет текста", defaultValue: "muted" }),
    ]),
    fontField({ name: "titleFont", label: "Шрифт заголовков карточек" }),
    weightField({ name: "titleWeight", label: "Насыщенность заголовков карточек" }),
  ],
};

export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Галерея", plural: "Галерея" },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Фото",
      labels: { singular: "фото", plural: "фото" },
      minRows: 1,
      maxRows: 24,
      admin: { initCollapsed: true },
      fields: [
        imageField({ name: "picture", label: "Фото", frames: framePresets.galleryTile, required: true }),
        bilingual({ name: "caption", label: "Подпись (необязательно)", maxLength: 80 }),
      ],
    },
    {
      name: "columns",
      type: "select",
      label: "Фото в ряд (компьютер)",
      defaultValue: "4",
      options: ["2", "3", "4", "5"].map((v) => ({ value: v, label: v })),
    },
  ],
};

export const FaqBlock: Block = {
  slug: "faq",
  labels: { singular: "Вопросы и ответы", plural: "Вопросы и ответы" },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Вопросы",
      labels: { singular: "вопрос", plural: "вопросы" },
      minRows: 1,
      maxRows: 30,
      admin: {
        initCollapsed: true,
        description: "Google показывает такие вопросы прямо в поиске — пишите так, как спрашивают покупатели.",
        components: { RowLabel: "/cms/admin/FaqRowLabel#FaqRowLabel" },
      },
      fields: [
        bilingual({ name: "question", label: "Вопрос", required: true, maxLength: 160 }),
        bilingual({ name: "answer", label: "Ответ", required: true, multiline: true, maxLength: 1500 }),
      ],
    },
    row([
      colorField({ name: "cardBackground", label: "Фон вопроса", defaultValue: "white" }),
      colorField({ name: "questionColor", label: "Цвет вопроса", defaultValue: "green-900" }),
    ]),
    colorField({ name: "answerColor", label: "Цвет ответа", defaultValue: "muted" }),
  ],
};

export const sectionBlocks = [ProductsBlock, TextImageBlock, FeaturesBlock, GalleryBlock, FaqBlock];

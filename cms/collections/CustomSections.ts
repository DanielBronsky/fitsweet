import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";
import { colorField } from "../fields/color";
import { sectionTitleFields } from "../fields/sectionTitle";
import { sectionBlocks } from "../blocks";
import { slugify } from "./Products";
import { defaultSectionOrder } from "../sections";

const fillDerived: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  const ru = data.heading?.text?.ru?.trim();
  if (ru) data.name = ru;
  if (!data.anchor && ru) data.anchor = slugify(ru);
  return data;
};

const addToLayout: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === "create") {
    const layout = await req.payload.findGlobal({ slug: "layout", depth: 0, req });
    const existing = (layout.blocks ?? []).map((b) => ({
      block: b.block,
      custom: (typeof b.custom === "object" ? b.custom?.id : b.custom) ?? undefined,
    }));
    const blocks = existing.length ? existing : defaultSectionOrder.map((block) => ({ block, custom: undefined }));
    if (!blocks.some((b) => b.block === "custom" && b.custom === doc.id)) {
      await req.payload.updateGlobal({
        slug: "layout",
        req,
        data: { blocks: [...blocks, { block: "custom", custom: doc.id }] } as never,
      });
    }
  }
  return doc;
};

export const CustomSections: CollectionConfig = {
  slug: "customSections",
  labels: { singular: "Раздел", plural: "Разделы" },
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "show"],
    description:
      "Новые разделы страницы: карточки товаров, текст с картинкой, преимущества, галерея, вопросы-ответы. Новый раздел встаёт в конец страницы — передвинуть можно в «Порядке блоков».",
  },
  access: { read: () => true },
  hooks: {
    beforeValidate: [fillDerived],
    afterChange: [addToLayout, afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Название", admin: { hidden: true } },
    {
      type: "tabs",
      tabs: [
        {
          name: "heading",
          label: "Заголовок",
          fields: [
            ...sectionTitleFields(),
            { name: "align", type: "radio", label: "Выравнивание", defaultValue: "center", options: [
              { value: "center", label: "По центру" },
              { value: "left", label: "Слева" },
            ] },
            bilingual({ name: "subtitle", label: "Текст под заголовком", multiline: true, maxLength: 300 }),
            colorField({ name: "subtitleColor", label: "Цвет текста под заголовком", defaultValue: "muted" }),
          ],
        },
        {
          label: "Содержимое",
          fields: [
            {
              name: "content",
              type: "blocks",
              label: "Шаблон раздела",
              labels: { singular: "шаблон", plural: "шаблон" },
              minRows: 1,
              maxRows: 1,
              blocks: sectionBlocks,
              admin: { initCollapsed: false, description: "Выберите шаблон и заполните его." },
            },
          ],
        },
        {
          label: "Оформление",
          fields: [colorField({ name: "background", label: "Цвет фона раздела", defaultValue: "white" })],
        },
      ],
    },
    {
      name: "show",
      type: "checkbox",
      label: "Показывать раздел",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "anchor",
      type: "text",
      label: "Якорь для ссылок",
      unique: true,
      admin: {
        position: "sidebar",
        description: "Латиницей, заполняется сам. По нему пункт меню прокручивает к разделу.",
      },
      validate: (value: string | null | undefined) =>
        !value || /^[a-z0-9-]+$/.test(value) || "Только латиница, цифры и дефис",
    },
  ],
};

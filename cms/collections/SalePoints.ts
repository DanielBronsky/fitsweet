import type { CollectionConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { bilingual } from "../fields/bilingual";

export const SalePoints: CollectionConfig = {
  slug: "salePoints",
  labels: { singular: "Точка продаж", plural: "Точки продаж" },
  orderable: true,
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "category", "active"],
    description: "Кафе, магазины и клубы, где продаётся FitSweet. Порядок в списке на сайте — перетаскиванием.",
  },
  access: { read: () => true },
  hooks: {
    afterChange: [afterContentChange],
    afterDelete: [afterContentChange],
  },
  fields: [
    { name: "name", type: "text", label: "Название", required: true, maxLength: 60 },
    bilingual({ name: "address", label: "Адрес", required: true, maxLength: 120 }),
    {
      type: "row",
      fields: [
        {
          name: "allDay",
          type: "checkbox",
          label: "Круглосуточно",
          defaultValue: false,
          admin: { width: "30%" },
        },
        {
          name: "hours",
          type: "text",
          label: "Часы работы",
          maxLength: 40,
          admin: {
            width: "70%",
            placeholder: "08:00 — 21:00",
            condition: (_, s) => !s?.allDay,
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Место на карте",
      fields: [
        {
          name: "mapPicker",
          type: "ui",
          admin: { components: { Field: "/cms/admin/MapPickerField#MapPickerField" } },
        },
        {
          type: "row",
          fields: [
            { name: "lat", type: "number", label: "Широта", required: true, admin: { width: "50%", step: 0.000001 } },
            { name: "lng", type: "number", label: "Долгота", required: true, admin: { width: "50%", step: 0.000001 } },
          ],
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "pointCategories",
      label: "Категория",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "active",
      type: "checkbox",
      label: "Показывать на сайте",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};

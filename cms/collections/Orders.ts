import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from "payload";
import type { Order } from "../../payload-types";
import { syncOrderMessages } from "../telegram/bot";

const FIRST_NUMBER = 1001;

const assignNumber: CollectionBeforeChangeHook = async ({ data, operation, req, originalDoc }) => {
  if (operation === "create") {
    const last = await req.payload.find({ collection: "orders", sort: "-number", limit: 1, depth: 0, req });
    data.number = Math.max(FIRST_NUMBER, (last.docs[0]?.number ?? FIRST_NUMBER - 1) + 1);
    data.status = "new";
  }
  const number = data.number ?? originalDoc?.number;
  const name = data.customer?.name ?? originalDoc?.customer?.name ?? "";
  data.title = `№${number} · ${name}`.trim();

  const prevStatus = originalDoc?.status;
  if (data.status && data.status !== prevStatus) {
    const now = new Date().toISOString();
    if (data.status === "accepted" && !data.acceptedAt) data.acceptedAt = now;
    if ((data.status === "done" || data.status === "cancelled") && !data.closedAt) data.closedAt = now;
  }
  return data;
};

const syncTelegram: CollectionAfterChangeHook<Order> = ({ doc, previousDoc, operation, context, req }) => {
  if (operation !== "update" || context.fromBot || doc.status === previousDoc?.status) return doc;
  void syncOrderMessages(req.payload, doc).catch(() => {});
  return doc;
};

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "Заказ", plural: "Заказы" },
  admin: {
    group: false,
    useAsTitle: "title",
    defaultColumns: ["title", "status", "total", "phone", "createdAt"],
    description: "Заказы с сайта. Статус меняют менеджеры в Telegram или здесь.",
    listSearchableFields: ["title", "phone"],
  },
  defaultSort: "-number",
  access: { read: isAdmin, create: () => false, update: isAdmin, delete: isAdmin },
  hooks: { beforeChange: [assignNumber], afterChange: [syncTelegram] },
  fields: [
    { name: "title", type: "text", label: "Заказ", admin: { hidden: true } },
    { name: "number", type: "number", label: "Номер", index: true, admin: { readOnly: true, position: "sidebar" } },
    {
      name: "status",
      type: "select",
      label: "Статус",
      defaultValue: "new",
      required: true,
      options: [
        { value: "new", label: "🆕 Новый" },
        { value: "accepted", label: "👌 Принят" },
        { value: "done", label: "✅ Выполнен" },
        { value: "cancelled", label: "✖️ Отменён" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "acceptedBy", type: "relationship", relationTo: "managers", label: "Принял(а)", admin: { readOnly: true, position: "sidebar" } },
    { name: "acceptedAt", type: "date", label: "Принят", admin: { readOnly: true, position: "sidebar", date: { pickerAppearance: "dayAndTime" } } },
    { name: "closedBy", type: "relationship", relationTo: "managers", label: "Закрыл(а)", admin: { readOnly: true, position: "sidebar" } },
    { name: "closedAt", type: "date", label: "Закрыт", admin: { readOnly: true, position: "sidebar", date: { pickerAppearance: "dayAndTime" } } },
    {
      name: "locale",
      type: "select",
      label: "Язык сайта",
      options: [
        { value: "ru", label: "Русский" },
        { value: "ro", label: "Română" },
      ],
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "customer",
      type: "group",
      label: "Покупатель",
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", label: "Имя", required: true, admin: { readOnly: true, width: "50%" } },
            { name: "phone", type: "text", label: "Телефон", required: true, admin: { readOnly: true, width: "50%" } },
          ],
        },
        { name: "address", type: "text", label: "Адрес", required: true, admin: { readOnly: true } },
        { name: "comment", type: "textarea", label: "Комментарий", admin: { readOnly: true } },
      ],
    },
    { name: "phone", type: "text", admin: { hidden: true } },
    {
      name: "items",
      type: "array",
      label: "Состав заказа",
      labels: { singular: "товар", plural: "товары" },
      admin: { readOnly: true, initCollapsed: true, components: { RowLabel: "/cms/admin/OrderItemRowLabel#OrderItemRowLabel" } },
      fields: [
        {
          type: "row",
          fields: [
            { name: "name", type: "text", label: "Товар", admin: { width: "46%" } },
            { name: "qty", type: "number", label: "Кол-во", admin: { width: "16%" } },
            { name: "price", type: "number", label: "Цена", admin: { width: "18%" } },
            { name: "sum", type: "number", label: "Сумма", admin: { width: "20%" } },
          ],
        },
        { name: "product", type: "relationship", relationTo: "products", admin: { hidden: true } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "subtotal", type: "number", label: "Товары, MDL", admin: { readOnly: true, width: "33%" } },
        { name: "shipping", type: "number", label: "Доставка, MDL", admin: { readOnly: true, width: "33%" } },
        { name: "total", type: "number", label: "Итого, MDL", admin: { readOnly: true, width: "34%" } },
      ],
    },
    { name: "telegram", type: "json", admin: { hidden: true } },
    { name: "note", type: "textarea", label: "Заметка менеджера", admin: { description: "Видно только в админке." } },
  ],
};

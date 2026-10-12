import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from "payload";
import type { Order } from "../../payload-types";
import { syncOrderMessages } from "../telegram/bot";

const TZ = "Europe/Chisinau";

function stampOf(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}${parts.second}`;
}

const assignNumber: CollectionBeforeChangeHook = async ({ data, operation, req, originalDoc }) => {
  if (operation === "create") {
    const base = stampOf(new Date());
    const taken = await req.payload.find({ collection: "orders", where: { number: { like: base } }, depth: 0, limit: 100, req });
    data.number = taken.totalDocs ? `${base}-${taken.totalDocs + 1}` : base;
    data.status = "new";
  }
  const number = data.number ?? originalDoc?.number;
  const name = data.customer?.name ?? originalDoc?.customer?.name ?? "";
  data.title = `№${number} · ${name}`.trim();
  const phone = data.customer?.phone ?? originalDoc?.customer?.phone ?? "";
  data.search = [number, name, phone, phone.replace(/\D/g, "")].filter(Boolean).join(" ");

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
    listSearchableFields: ["search"],
  },
  defaultSort: "-number",
  access: { read: isAdmin, create: () => false, update: isAdmin, delete: isAdmin },
  hooks: { beforeChange: [assignNumber], afterChange: [syncTelegram] },
  fields: [
    { name: "title", type: "text", label: "Заказ", admin: { hidden: true } },
    { name: "search", type: "text", label: "номеру, имени или телефону", index: true, admin: { readOnly: true, components: { Field: "/cms/admin/Nothing#Nothing" } } },
    { name: "number", type: "text", label: "Номер", index: true, admin: { hidden: true } },
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
      admin: { position: "sidebar", isClearable: false },
    },
    { name: "meta", type: "ui", admin: { position: "sidebar", components: { Field: "/cms/admin/OrderMeta#OrderMeta" } } },
    { name: "acceptedBy", type: "relationship", relationTo: "managers", label: "Принял(а)", admin: { hidden: true } },
    { name: "acceptedAt", type: "date", label: "Принят", admin: { hidden: true } },
    { name: "closedBy", type: "relationship", relationTo: "managers", label: "Закрыл(а)", admin: { hidden: true } },
    { name: "closedAt", type: "date", label: "Закрыт", admin: { hidden: true } },
    {
      name: "locale",
      type: "select",
      label: "Язык сайта",
      options: [
        { value: "ru", label: "Русский" },
        { value: "ro", label: "Română" },
      ],
      admin: { hidden: true },
    },
    { name: "summary", type: "ui", admin: { components: { Field: "/cms/admin/OrderSummary#OrderSummary" } } },
    {
      name: "customer",
      type: "group",
      label: "Покупатель",
      admin: { hidden: true },
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
    { name: "phone", type: "text", label: "Телефон", admin: { readOnly: true, components: { Field: "/cms/admin/Nothing#Nothing" } } },
    {
      name: "items",
      type: "array",
      label: "Состав заказа",
      labels: { singular: "товар", plural: "товары" },
      admin: { hidden: true },
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
    { name: "subtotal", type: "number", label: "Товары, MDL", admin: { hidden: true } },
    { name: "shipping", type: "number", label: "Доставка, MDL", admin: { hidden: true } },
    { name: "total", type: "number", label: "Итого, MDL", admin: { readOnly: true, components: { Field: "/cms/admin/Nothing#Nothing" } } },
    { name: "telegram", type: "json", admin: { hidden: true } },
    { name: "note", type: "textarea", label: "Заметка менеджера", admin: { description: "Видно только в админке." } },
  ],
};

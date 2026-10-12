import crypto from "crypto";
import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

export const newInviteToken = (prefix = "") => prefix + crypto.randomBytes(18).toString("base64url");

const SYSTEM_FIELDS = ["inviteToken", "chatId", "telegramUsername", "connectedAt"] as const;

const protectSystemFields: CollectionBeforeChangeHook = ({ data, originalDoc, context }) => {
  if (!context.system && originalDoc) for (const key of SYSTEM_FIELDS) data[key] = originalDoc[key];
  if (!data.inviteToken) data.inviteToken = newInviteToken();
  return data;
};

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Managers: CollectionConfig = {
  slug: "managers",
  labels: { singular: "Менеджер", plural: "Менеджеры" },
  admin: {
    group: false,
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "active", "paused"],
    description: "Кто получает заказы в Telegram-боте и нажимает «Принять». Добавьте человека и отправьте ему ссылку-приглашение.",
  },
  access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { beforeChange: [protectSystemFields] },
  endpoints: [
    {
      path: "/:id/reset",
      method: "post",
      handler: async (req) => {
        if (!req.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const id = Number(req.routeParams?.id);
        if (!id) return Response.json({ error: "bad-id" }, { status: 400 });
        await req.payload.update({
          collection: "managers",
          id,
          data: { inviteToken: newInviteToken(), chatId: null, telegramUsername: null, connectedAt: null },
          context: { system: true },
          req,
        });
        return Response.json({ ok: true });
      },
    },
  ],
  fields: [
    { name: "name", type: "text", label: "Имя", required: true, admin: { description: "Так будет подписано «Принял(а): …» в боте и в заказах." } },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", label: "Телефон", admin: { width: "50%", description: "Для себя — бот по номеру не ищет." } },
        { name: "username", type: "text", label: "Логин в Telegram", admin: { width: "50%", placeholder: "@login", description: "Для себя." } },
      ],
    },
    {
      name: "invite",
      type: "ui",
      admin: {
        components: {
          Field: { path: "/cms/admin/ManagerInvite#ManagerInvite", clientProps: { bot: process.env.TELEGRAM_BOT_USERNAME ?? "" } },
        },
      },
    },
    { name: "active", type: "checkbox", label: "Получает заказы", defaultValue: true, admin: { position: "sidebar" } },
    {
      name: "paused",
      type: "checkbox",
      label: "На паузе",
      defaultValue: false,
      admin: { position: "sidebar", description: "Менеджер сам ставит паузу командой /pause в боте и снимает /resume." },
    },
    { name: "inviteToken", type: "text", index: true, admin: { hidden: true } },
    { name: "chatId", type: "text", label: "Подключён", admin: { hidden: true } },
    { name: "telegramUsername", type: "text", admin: { hidden: true } },
    { name: "connectedAt", type: "date", admin: { hidden: true } },
  ],
};

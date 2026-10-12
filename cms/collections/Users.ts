import {
  APIError,
  type CollectionAfterLoginHook,
  type CollectionBeforeChangeHook,
  type CollectionBeforeLoginHook,
  type CollectionConfig,
  type PayloadRequest,
} from "payload";
import { newInviteToken } from "./Managers";
import { botIsPolling } from "../telegram/bot";
import { describeBrowser, escapeHtml, loginWhen, notifyOtherAdmins, requestLoginApproval } from "../telegram/login-approval";

const SYSTEM_FIELDS = ["inviteToken", "chatId", "telegramUsername", "connectedAt"] as const;

const protectSystemFields: CollectionBeforeChangeHook = ({ data, originalDoc, context }) => {
  if (!context.system && originalDoc) for (const key of SYSTEM_FIELDS) data[key] = originalDoc[key];
  if (!data.inviteToken && !originalDoc?.inviteToken) data.inviteToken = newInviteToken("u_");
  return data;
};

const twoFactorOff = () => process.env.ADMIN_2FA === "off";

const ipOf = (req: PayloadRequest) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "неизвестен";

async function otherAdminChats(req: PayloadRequest, exceptId: number) {
  const { docs } = await req.payload.find({
    collection: "users",
    where: { and: [{ chatId: { exists: true } }, { id: { not_equals: exceptId } }] },
    depth: 0,
    limit: 20,
    overrideAccess: true,
  });
  return docs.map((d) => d.chatId).filter((c): c is string => Boolean(c));
}

const loginSummary = (req: PayloadRequest) =>
  `🕒 ${loginWhen()} · 🌐 ${escapeHtml(ipOf(req))} · 💻 ${escapeHtml(describeBrowser(req.headers.get("user-agent") ?? ""))}`;

const announceLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  const chats = await otherAdminChats(req, user.id).catch(() => []);
  if (!chats.length) return user;
  const who = escapeHtml(user.name || user.email);
  const confirmed = user.chatId && !twoFactorOff();
  void notifyOtherAdmins(
    chats,
    `🔓 <b>${who}</b> вошёл(ла) в админку${confirmed ? "" : " · ⚠️ <b>без подтверждения в Telegram</b>"}\n${loginSummary(req)}`,
  );
  return user;
};

const confirmInTelegram: CollectionBeforeLoginHook = async ({ user, req }) => {
  if (twoFactorOff() || !user?.chatId) return user;
  if (!botIsPolling()) {
    throw new APIError("Подтверждение входа через Telegram сейчас недоступно: бот не запущен на сервере.", 503, null, true);
  }
  const ip = ipOf(req);
  const result = await requestLoginApproval({
    chatId: user.chatId,
    name: user.name || user.email,
    ip,
    userAgent: req.headers.get("user-agent") ?? "",
  });
  if (result.ok) return user;
  if (result.reason === "denied") {
    const chats = await otherAdminChats(req, user.id).catch(() => []);
    void notifyOtherAdmins(
      chats,
      `🚫 <b>Отклонена попытка входа</b> под аккаунтом ${escapeHtml(user.name || user.email)} — пароль был введён верно.\n${loginSummary(req)}`,
    );
  }
  throw new APIError(
    result.reason === "send" ? "Не удалось отправить подтверждение в Telegram. Попробуйте ещё раз." : "Вход не подтверждён в Telegram.",
    401,
    null,
    true,
  );
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Администратор", plural: "Администраторы" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
    group: false,
  },
  auth: {
    tokenExpiration: 180,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    useSessions: true,
    cookies: {
      sameSite: "Lax",
      secure: process.env.ADMIN_COOKIE_SECURE === "true",
    },
  },
  hooks: { beforeChange: [protectSystemFields], beforeLogin: [confirmInTelegram], afterLogin: [announceLogin] },
  endpoints: [
    {
      path: "/:id/telegram-reset",
      method: "post",
      handler: async (req) => {
        if (!req.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const id = Number(req.routeParams?.id);
        if (!id) return Response.json({ error: "bad-id" }, { status: 400 });
        await req.payload.update({
          collection: "users",
          id,
          data: { inviteToken: newInviteToken("u_"), chatId: null, telegramUsername: null, connectedAt: null },
          context: { system: true },
          req,
        });
        return Response.json({ ok: true });
      },
    },
  ],
  fields: [
    { name: "name", type: "text", label: "Имя" },
    {
      name: "telegram",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "/cms/admin/ManagerInvite#ManagerInvite",
            clientProps: { bot: process.env.TELEGRAM_BOT_USERNAME ?? "", collection: "users" },
          },
        },
      },
    },
    { name: "inviteToken", type: "text", index: true, admin: { hidden: true } },
    { name: "chatId", type: "text", admin: { hidden: true } },
    { name: "telegramUsername", type: "text", admin: { hidden: true } },
    { name: "connectedAt", type: "date", admin: { hidden: true } },
  ],
};

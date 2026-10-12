import crypto from "crypto";
import { adminBotToken, botToken, tg } from "./api";

type Pending = { resolve: (ok: boolean) => void; chatId: string; messageId?: number; text: string; token?: string };

const tokens = () => [...new Set([adminBotToken(), botToken()].filter(Boolean))];

const state = globalThis as unknown as { __fitsweetLogins?: Map<string, Pending> };
const pending = (state.__fitsweetLogins ??= new Map());

export const LOGIN_TIMEOUT_MS = 90_000;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function describeBrowser(ua: string) {
  const os = /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "неизвестная система";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "браузер";
  return `${browser}, ${os}`;
}

export async function requestLoginApproval({ chatId, name, ip, userAgent }: { chatId: string; name: string; ip: string; userAgent: string }) {
  const id = crypto.randomBytes(9).toString("base64url");
  const when = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Chisinau", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  const text = [
    `🔐 <b>Вход в админку FitSweet</b>`,
    "",
    `👤 ${esc(name)}`,
    `🕒 ${when}`,
    `🌐 IP: ${esc(ip)}`,
    `💻 ${esc(describeBrowser(userAgent))}`,
    "",
    "Это вы? Подтвердите в течение 90 секунд.",
  ].join("\n");

  const result = new Promise<boolean>((resolve) => {
    pending.set(id, { resolve, chatId, text });
  });

  let delivered = false;
  for (const token of tokens()) {
    try {
      const sent = await tg<{ message_id: number }>(
        "sendMessage",
        {
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Да, это я", callback_data: `login:${id}:ok` },
                { text: "🚫 Это не я", callback_data: `login:${id}:no` },
              ],
            ],
          },
        },
        15000,
        token,
      );
      const entry = pending.get(id);
      if (entry) Object.assign(entry, { messageId: sent.message_id, token });
      delivered = true;
      break;
    } catch {}
  }
  if (!delivered) {
    pending.delete(id);
    return { ok: false as const, reason: "send" as const };
  }

  const timer = setTimeout(() => settle(id, false, "⌛ <b>Время вышло</b> — вход не выполнен."), LOGIN_TIMEOUT_MS);
  const ok = await result;
  clearTimeout(timer);
  return ok ? { ok: true as const } : { ok: false as const, reason: "denied" as const };
}

function settle(id: string, ok: boolean, footer: string) {
  const entry = pending.get(id);
  if (!entry) return false;
  pending.delete(id);
  entry.resolve(ok);
  if (entry.messageId) {
    const body = entry.text.replace(/\n\nЭто вы\?.*$/, "");
    void tg("editMessageText", { chat_id: entry.chatId, message_id: entry.messageId, text: `${body}\n\n${footer}`, parse_mode: "HTML" }, 15000, entry.token).catch(() => {});
  }
  return true;
}

export function answerLoginApproval(id: string, ok: boolean, fromChatId: string) {
  const entry = pending.get(id);
  if (!entry || entry.chatId !== fromChatId) return false;
  return settle(
    id,
    ok,
    ok ? "✅ <b>Вход подтверждён.</b>" : "🚫 <b>Вход отклонён.</b> Если это были не вы — смените пароль в админке.",
  );
}

export async function notifyOtherAdmins(chatIds: string[], text: string) {
  for (const chatId of chatIds) {
    for (const token of tokens()) {
      const ok = await tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML" }, 15000, token).then(
        () => true,
        () => false,
      );
      if (ok) break;
    }
  }
}

export const loginWhen = () =>
  new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Chisinau", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date());

export const escapeHtml = esc;

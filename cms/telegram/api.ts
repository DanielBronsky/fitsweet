export const botToken = () => process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
export const botUsername = () => (process.env.TELEGRAM_BOT_USERNAME?.trim() || "").replace(/^@/, "");

export const hasAdminBot = () => Boolean(process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim()) && process.env.TELEGRAM_ADMIN_BOT_TOKEN?.trim() !== botToken();
export const adminBotToken = () => (hasAdminBot() ? process.env.TELEGRAM_ADMIN_BOT_TOKEN!.trim() : botToken());
export const adminBotUsername = () =>
  hasAdminBot() ? (process.env.TELEGRAM_ADMIN_BOT_USERNAME?.trim() || "").replace(/^@/, "") : botUsername();

export type InlineButton = { text: string; callback_data?: string; url?: string };
export type InlineKeyboard = { inline_keyboard: InlineButton[][] };

export class TelegramError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message);
  }
}

export async function tg<T = unknown>(method: string, params: Record<string, unknown> = {}, timeoutMs = 15000, token = botToken()): Promise<T> {
  if (!token) throw new TelegramError("TELEGRAM_BOT_TOKEN не задан", 0);
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const data = (await res.json().catch(() => null)) as { ok: boolean; result?: T; description?: string; error_code?: number } | null;
  if (!data?.ok) throw new TelegramError(data?.description ?? `HTTP ${res.status}`, data?.error_code ?? res.status);
  return data.result as T;
}

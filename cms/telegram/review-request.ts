import type { Payload } from "payload";
import type { Order } from "../../payload-types";
import { getDictionary, isLocale } from "../../lib/i18n";
import { tg } from "./api";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendReviewRequest(payload: Payload, order: Order, chatId: string | null | undefined) {
  if (!chatId) return;
  const [seo, section] = await Promise.all([
    payload.findGlobal({ slug: "seo", depth: 0 }).catch(() => null),
    payload.findGlobal({ slug: "reviewsSection", depth: 0 }).catch(() => null),
  ]);
  const link = seo?.business?.reviewUrl;
  const g = section?.google;
  if (!link || g?.askAfterDone === false) return;

  const locale = order.locale && isLocale(order.locale) ? order.locale : "ru";
  const name = order.customer?.name?.trim() || "";
  const phone = order.customer?.phone ?? "";
  const template = g?.askText?.[locale] || getDictionary(locale).reviews.askText;
  const text = template.replaceAll("{name}", name).replaceAll("{link}", link).replace(/,\s*!/, "!").trim();
  const digits = phone.replace(/\D/g, "");

  const buttons = [
    ...(digits.length >= 8 ? [{ text: "💬 Отправить в WhatsApp", url: `https://wa.me/${digits}?text=${encodeURIComponent(text)}` }] : []),
    { text: "📨 Переслать в Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text.replace(link, "").trim())}` },
  ];

  await tg("sendMessage", {
    chat_id: chatId,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    text: [
      `⭐ <b>Попросите отзыв</b> — заказ №${esc(order.number ?? "")} выполнен`,
      `👤 ${esc(name)} · ${esc(phone)}`,
      "",
      "Перешлите покупателю (нажмите на текст — скопируется):",
      `<pre>${esc(text)}</pre>`,
    ].join("\n"),
    reply_markup: { inline_keyboard: [buttons] },
  }).catch((err) => console.log("[telegram] просьба об отзыве:", (err as Error).message));
}

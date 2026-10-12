import type { Payload } from "payload";
import type { Manager, Order } from "../../payload-types";
import { newInviteToken } from "../collections/Managers";
import { botToken, tg, TelegramError } from "./api";
import { orderKeyboard, orderText, type OrderStatus, type OrderView } from "./format";

type MessageRef = { chatId: string; messageId: number };
type TgUser = { id: number; username?: string; first_name?: string };
type TgMessage = { message_id: number; chat: { id: number; type: string }; from?: TgUser; text?: string };
type TgCallback = { id: string; from: TgUser; data?: string };
type TgUpdate = { update_id: number; message?: TgMessage; callback_query?: TgCallback };

const log = (...args: unknown[]) => console.log("[telegram]", ...args);

let chain: Promise<unknown> = Promise.resolve();
const exclusive = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
};

function adminUrl(id: number) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!/^https:\/\//.test(base) || /localhost|127\.0\.0\.1/.test(base)) return null;
  return `${base.replace(/\/$/, "")}/admin/collections/orders/${id}`;
}

const managerName = (m: Order["acceptedBy"]) => (m && typeof m === "object" ? m.name : null);

async function managerNames(payload: Payload, ids: (number | null | undefined)[]) {
  const wanted = ids.filter((x): x is number => typeof x === "number");
  if (!wanted.length) return new Map<number, string>();
  const { docs } = await payload.find({ collection: "managers", where: { id: { in: wanted } }, depth: 0, limit: 10, overrideAccess: true });
  return new Map(docs.map((d) => [d.id, d.name]));
}

async function toView(payload: Payload, order: Order): Promise<OrderView> {
  const idOf = (v: Order["acceptedBy"]) => (v && typeof v === "object" ? v.id : (v ?? null));
  const names = await managerNames(payload, [idOf(order.acceptedBy), idOf(order.closedBy)]);
  const nameOf = (v: Order["acceptedBy"]) => managerName(v) ?? (idOf(v) ? (names.get(idOf(v)!) ?? null) : null);
  return {
    id: order.id,
    number: order.number ?? "",
    status: (order.status ?? "new") as OrderStatus,
    createdAt: order.createdAt,
    customer: {
      name: order.customer?.name ?? "",
      phone: order.customer?.phone ?? "",
      address: order.customer?.address ?? "",
      comment: order.customer?.comment,
    },
    items: (order.items ?? []).map((i) => ({ name: i.name ?? "", qty: i.qty ?? 0, sum: i.sum ?? 0 })),
    subtotal: order.subtotal ?? 0,
    shipping: order.shipping ?? 0,
    total: order.total ?? 0,
    acceptedBy: nameOf(order.acceptedBy),
    acceptedAt: order.acceptedAt,
    closedBy: nameOf(order.closedBy),
    closedAt: order.closedAt,
  };
}

const refsOf = (order: Order) => ((order.telegram as { messages?: MessageRef[] } | null)?.messages ?? []).filter((r) => r.chatId && r.messageId);

export async function notifyNewOrder(payload: Payload, order: Order) {
  if (!botToken()) return;
  const { docs: managers } = await payload.find({
    collection: "managers",
    where: { and: [{ active: { equals: true } }, { paused: { not_equals: true } }, { chatId: { exists: true } }] },
    depth: 0,
    limit: 100,
    overrideAccess: true,
  });
  const view = await toView(payload, order);
  const refs: MessageRef[] = [];
  for (const m of managers) {
    if (!m.chatId) continue;
    try {
      const sent = await tg<{ message_id: number }>("sendMessage", {
        chat_id: m.chatId,
        text: orderText(view),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: orderKeyboard(view, adminUrl(order.id)),
      });
      refs.push({ chatId: m.chatId, messageId: sent.message_id });
    } catch (err) {
      log(`не удалось отправить заказ №${order.number} менеджеру «${m.name}»:`, (err as Error).message);
    }
  }
  if (!managers.length) log(`заказ №${order.number}: нет подключённых менеджеров`);
  await payload.update({ collection: "orders", id: order.id, data: { telegram: { messages: refs } }, context: { fromBot: true }, overrideAccess: true });
}

export async function syncOrderMessages(payload: Payload, order: Order) {
  if (!botToken()) return;
  const view = await toView(payload, order);
  for (const ref of refsOf(order)) {
    try {
      await tg("editMessageText", {
        chat_id: ref.chatId,
        message_id: ref.messageId,
        text: orderText(view),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: orderKeyboard(view, adminUrl(order.id)),
      });
    } catch (err) {
      if (!/not modified/i.test((err as Error).message)) log(`не удалось обновить заказ №${order.number}:`, (err as Error).message);
    }
  }
}

const reply = (chatId: number | string, text: string) => tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML" });

async function sendOrderTo(payload: Payload, order: Order, chatId: string) {
  const view = await toView(payload, order);
  const sent = await tg<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text: orderText(view),
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
    reply_markup: orderKeyboard(view, adminUrl(order.id)),
  });
  await exclusive(async () => {
    const fresh = await payload.findByID({ collection: "orders", id: order.id, depth: 0, overrideAccess: true });
    const messages = [...refsOf(fresh), { chatId, messageId: sent.message_id }];
    await payload.update({ collection: "orders", id: order.id, data: { telegram: { messages } }, context: { fromBot: true }, overrideAccess: true });
  });
}

const LIST_LIMIT = 10;

async function sendOrderList(payload: Payload, chatId: string, where: Record<string, unknown>, empty: string, title: (n: number) => string) {
  const { docs, totalDocs } = await payload.find({ collection: "orders", where: where as never, sort: "number", depth: 1, limit: LIST_LIMIT, overrideAccess: true });
  if (!docs.length) return reply(chatId, empty);
  await reply(chatId, title(totalDocs) + (totalDocs > LIST_LIMIT ? `\nПоказаны первые ${LIST_LIMIT}, остальные — в админке.` : ""));
  for (const order of docs) await sendOrderTo(payload, order, chatId).catch((err) => log("список заказов:", (err as Error).message));
}

const TZ = "Europe/Chisinau";
const dayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

async function sendToday(payload: Payload, chatId: string) {
  const since = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { docs } = await payload.find({ collection: "orders", where: { createdAt: { greater_than: since } }, depth: 0, limit: 500, pagination: false, overrideAccess: true });
  const today = dayKey(new Date());
  const list = docs.filter((o) => dayKey(new Date(o.createdAt)) === today);
  const by = (s: string) => list.filter((o) => o.status === s);
  const sum = (arr: typeof list) => arr.reduce((t, o) => t + (o.total ?? 0), 0);
  const active = list.filter((o) => o.status !== "cancelled");
  const date = new Intl.DateTimeFormat("ru-RU", { timeZone: TZ, day: "numeric", month: "long" }).format(new Date());
  await reply(
    chatId,
    [
      `📊 <b>Сводка за ${date}</b>`,
      "",
      `Заказов: <b>${list.length}</b> на <b>${sum(active)} MDL</b>`,
      `🆕 Ждут: ${by("new").length}`,
      `👌 В работе: ${by("accepted").length}`,
      `✅ Выполнено: ${by("done").length} · ${sum(by("done"))} MDL`,
      `✖️ Отменено: ${by("cancelled").length}`,
    ].join("\n"),
  );
}

const COMMANDS = [
  { command: "new", description: "Непринятые заказы" },
  { command: "my", description: "Мои заказы в работе" },
  { command: "today", description: "Сводка за день" },
  { command: "pause", description: "Пауза — не получать заказы" },
  { command: "resume", description: "Снова получать заказы" },
  { command: "start", description: "Статус подключения" },
];

async function findManagerByChat(payload: Payload, chatId: number): Promise<Manager | null> {
  const { docs } = await payload.find({ collection: "managers", where: { chatId: { equals: String(chatId) } }, depth: 0, limit: 1, overrideAccess: true });
  return docs[0] ?? null;
}

async function handleMessage(payload: Payload, msg: TgMessage) {
  if (msg.chat.type !== "private" || !msg.text) return;
  const [command, token] = msg.text.trim().split(/\s+/, 2);
  const chatId = msg.chat.id;

  if (command === "/start" && token) {
    const { docs } = await payload.find({ collection: "managers", where: { inviteToken: { equals: token } }, depth: 0, limit: 1, overrideAccess: true });
    const manager = docs[0];
    if (!manager || (manager.chatId && manager.chatId !== String(chatId))) {
      await reply(chatId, "Ссылка недействительна или уже использована. Попросите новую в админке сайта.");
      return;
    }
    await payload.update({
      collection: "managers",
      id: manager.id,
      data: { chatId: String(chatId), telegramUsername: msg.from?.username ?? null, connectedAt: new Date().toISOString(), inviteToken: newInviteToken() },
      context: { system: true },
      overrideAccess: true,
    });
    await reply(
      chatId,
      `Готово, ${manager.name}! 👋\n\nСюда будут приходить новые заказы FitSweet. Нажмите «✅ Принять заказ», когда берёте его в работу, потом отметьте «Выполнен» или «Отменить».`,
    );
    log(`менеджер «${manager.name}» подключён`);
    return;
  }

  const manager = await findManagerByChat(payload, chatId);
  if (!manager) {
    await reply(chatId, "Это бот заказов FitSweet. Подключиться можно только по личной ссылке из админки сайта.");
    return;
  }
  if (manager.active === false) {
    await reply(chatId, "Вы подключены, но получение заказов выключено в админке. Обратитесь к администратору.");
    return;
  }
  const chat = String(chatId);
  const name = command.replace(/@.*$/, "");

  if (name === "/new") {
    await sendOrderList(payload, chat, { status: { equals: "new" } }, "Непринятых заказов нет 👌", (n) => `🆕 <b>Непринятые заказы: ${n}</b>`);
  } else if (name === "/my") {
    await sendOrderList(
      payload,
      chat,
      { and: [{ status: { equals: "accepted" } }, { acceptedBy: { equals: manager.id } }] },
      "У вас нет заказов в работе.",
      (n) => `👌 <b>Ваши заказы в работе: ${n}</b>`,
    );
  } else if (name === "/today") {
    await sendToday(payload, chat);
  } else if (name === "/pause") {
    await payload.update({ collection: "managers", id: manager.id, data: { paused: true }, overrideAccess: true });
    await reply(chat, "⏸ <b>Пауза включена.</b> Новые заказы приходить не будут. Свои принятые заказы закрыть можно.\n\nВернуться — /resume");
  } else if (name === "/resume") {
    await payload.update({ collection: "managers", id: manager.id, data: { paused: false }, overrideAccess: true });
    await reply(chat, "▶️ <b>Снова на связи.</b> Новые заказы будут приходить сюда.\n\nПропущенные непринятые — /new");
  } else {
    await reply(
      chat,
      manager.paused
        ? `Вы подключены, ${manager.name}, но сейчас <b>на паузе</b> ⏸ — новые заказы не приходят.\n\nВернуться — /resume`
        : `Вы подключены ✅, ${manager.name}. Новые заказы придут сюда.\n\n/new — непринятые\n/my — мои в работе\n/today — сводка за день\n/pause — пауза`,
    );
  }
}

async function handleCallback(payload: Payload, cq: TgCallback) {
  const answer = (text: string, alert = false) => tg("answerCallbackQuery", { callback_query_id: cq.id, text, show_alert: alert });
  const m = cq.data?.match(/^o:(\d+):(accept|done|cancel)$/);
  if (!m) return answer("Неизвестное действие");

  const manager = await findManagerByChat(payload, cq.from.id);
  if (!manager || manager.active === false) return answer("Вы не подключены как менеджер FitSweet.", true);

  const id = Number(m[1]);
  const action = m[2] as "accept" | "done" | "cancel";

  const result = await exclusive(async () => {
    const order = await payload.findByID({ collection: "orders", id, depth: 1, overrideAccess: true }).catch(() => null);
    if (!order) return { error: "Заказ не найден" };
    if (action === "accept") {
      if (order.status !== "new") return { error: `Заказ уже ${order.status === "accepted" ? `принял(а) ${managerName(order.acceptedBy) ?? "другой менеджер"}` : "закрыт"}`, order };
      return {
        order: await payload.update({ collection: "orders", id, data: { status: "accepted", acceptedBy: manager.id }, context: { fromBot: true }, overrideAccess: true, depth: 1 }),
      };
    }
    if (order.status !== "accepted") return { error: order.status === "new" ? "Сначала примите заказ" : "Заказ уже закрыт", order };
    return {
      order: await payload.update({
        collection: "orders",
        id,
        data: { status: action === "done" ? "done" : "cancelled", closedBy: manager.id },
        context: { fromBot: true },
        overrideAccess: true,
        depth: 1,
      }),
    };
  });

  if (result.error) {
    await answer(result.error, true);
    if (result.order) await syncOrderMessages(payload, result.order);
    return;
  }
  await answer(action === "accept" ? "Заказ ваш 👌" : action === "done" ? "Отмечен как выполненный ✅" : "Заказ отменён");
  if (result.order) await syncOrderMessages(payload, result.order);
}

async function handleUpdate(payload: Payload, u: TgUpdate) {
  if (u.message) await handleMessage(payload, u.message);
  else if (u.callback_query) await handleCallback(payload, u.callback_query);
}

const state = globalThis as unknown as { __fitsweetBot?: boolean };

export function startBot(getPayload: () => Promise<Payload>) {
  if (!botToken() || state.__fitsweetBot) return;
  state.__fitsweetBot = true;

  (async () => {
    const payload = await getPayload();
    await tg("deleteWebhook").catch(() => {});
    await tg("setMyCommands", { commands: COMMANDS }).catch(() => {});
    log("бот запущен, жду обновления");
    let offset = 0;
    let conflictLogged = false;
    for (;;) {
      try {
        const updates = await tg<TgUpdate[]>("getUpdates", { offset, timeout: 50, allowed_updates: ["message", "callback_query"] }, 65000);
        conflictLogged = false;
        for (const u of updates) {
          offset = u.update_id + 1;
          await handleUpdate(payload, u).catch((err) => log("ошибка обработки:", (err as Error).message));
        }
      } catch (err) {
        if (err instanceof TelegramError && err.code === 409) {
          if (!conflictLogged) log("бота уже слушает другой запущенный сервер — жду");
          conflictLogged = true;
          await new Promise((r) => setTimeout(r, 30000));
        } else {
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }
  })().catch((err) => {
    state.__fitsweetBot = false;
    log("бот остановлен:", (err as Error).message);
  });
}

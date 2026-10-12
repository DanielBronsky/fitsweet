"use client";

import { useEffect, useState } from "react";
import { useConfig, useDocumentInfo, useFormFields } from "@payloadcms/ui";

type Status = { chatId?: string | null; telegramUsername?: string | null; connectedAt?: string | null; inviteToken?: string | null; adminBotLinked?: boolean | null };

const box = { border: "1px solid var(--theme-elevation-150)", borderRadius: 8, padding: 16, marginBottom: 24 } as const;
const muted = { fontSize: 13, color: "var(--theme-elevation-500)", margin: 0 } as const;

export function ManagerInvite({
  bot,
  collection = "managers",
  separateAdminBot = false,
}: {
  bot?: string;
  collection?: "managers" | "users";
  separateAdminBot?: boolean;
}) {
  const admin = collection === "users";
  const { config } = useConfig();
  const { id } = useDocumentInfo();
  const form = useFormFields(([f]) => ({
    chatId: f.chatId?.value as string | null,
    telegramUsername: f.telegramUsername?.value as string | null,
    connectedAt: f.connectedAt?.value as string | null,
    inviteToken: f.inviteToken?.value as string | null,
    adminBotLinked: f.adminBotLinked?.value as boolean | null,
  }));
  const [live, setLive] = useState<Status | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const status = live ?? form;
  const connected = Boolean(status.chatId);
  const api = `${config.serverURL}${config.routes.api}/${collection}/${id}`;

  useEffect(() => {
    if (!id || connected) return;
    const timer = setInterval(async () => {
      const res = await fetch(`${api}?depth=0`, { credentials: "include" }).catch(() => null);
      const doc = (await res?.json().catch(() => null)) as Status | null;
      if (doc?.chatId) setLive(doc);
    }, 4000);
    return () => clearInterval(timer);
  }, [id, connected, api]);

  if (!bot) return <div style={box}><p style={muted}>Бот не настроен: на сервере не задан TELEGRAM_BOT_USERNAME.</p></div>;
  if (!id)
    return (
      <div style={box}>
        <p style={muted}>
          {admin ? "Сохраните администратора — здесь появится ссылка для подключения подтверждения входа." : "Сохраните менеджера — здесь появится личная ссылка-приглашение в бота."}
        </p>
      </div>
    );

  const link = status.inviteToken ? `https://t.me/${bot}?start=${status.inviteToken}` : "";

  const reset = async () => {
    const question = admin
      ? separateAdminBot && !status.adminBotLinked
        ? `Получить новую ссылку на @${bot}? До подключения вход будет только по паролю.`
        : "Отключить подтверждение входа через Telegram? Вход станет только по паролю, пока не подключите снова."
      : "Отключить этого человека от бота? Старая ссылка перестанет работать, появится новая.";
    if (!confirm(question)) return;
    setBusy(true);
    await fetch(`${api}/${admin ? "telegram-reset" : "reset"}`, { method: "POST", credentials: "include" }).catch(() => null);
    const res = await fetch(`${api}?depth=0`, { credentials: "include" }).catch(() => null);
    setLive(((await res?.json().catch(() => null)) as Status | null) ?? null);
    setBusy(false);
  };

  if (connected && admin && separateAdminBot && !status.adminBotLinked) {
    return (
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>🔁 Переподключите к @{bot}</p>
        <p style={{ ...muted, marginTop: 6 }}>
          Сейчас вход подтверждается через бот заказов. Для админов теперь отдельный бот — нажмите кнопку ниже, затем откройте новую ссылку и нажмите
          «Старт» в @{bot}.
        </p>
        <button type="button" className="btn btn--style-primary btn--size-small" style={{ margin: "12px 0 0" }} onClick={reset} disabled={busy}>
          Получить ссылку на @{bot}
        </button>
      </div>
    );
  }

  if (connected) {
    const when = status.connectedAt ? new Date(status.connectedAt).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" }) : "";
    return (
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{admin ? "🔐 Вход подтверждается в Telegram" : "✅ Подключён к боту"}</p>
        <p style={{ ...muted, marginTop: 6 }}>
          {status.telegramUsername ? `@${status.telegramUsername} · ` : ""}
          {when}. {admin ? `После ввода пароля в @${bot} придёт запрос «Это вы?».` : `Заказы приходят ему в @${bot}.`}
        </p>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: "12px 0 0" }} onClick={reset} disabled={busy}>
          {admin ? "Отключить подтверждение" : "Отключить и выдать новую ссылку"}
        </button>
      </div>
    );
  }

  return (
    <div style={box}>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{admin ? "⚠️ Вход только по паролю" : "⏳ Ещё не подключён"}</p>
      <p style={{ ...muted, marginTop: 6 }}>
        {admin
          ? "Подключите Telegram: откройте ссылку на своём телефоне и нажмите «Старт». После этого каждый вход нужно будет подтверждать в боте."
          : "Отправьте эту ссылку человеку. Он откроет её в Telegram и нажмёт «Старт» — статус здесь сменится сам. Ссылка одноразовая."}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 6,
            background: "var(--theme-input-bg)",
            color: "inherit",
            fontSize: 13,
          }}
        />
        <button
          type="button"
          className="btn btn--style-primary btn--size-small"
          style={{ margin: 0 }}
          onClick={async () => {
            await navigator.clipboard.writeText(link).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? "Скопировано" : "Скопировать"}
        </button>
      </div>
    </div>
  );
}

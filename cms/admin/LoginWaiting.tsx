"use client";

import { useEffect, useState } from "react";

const WAIT_MS = 90_000;
const SHOW_AFTER_MS = 1200;

export function LoginWaiting({ bot }: { bot: string }) {
  const [since, setSince] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const original = window.fetch;
    let inflight = 0;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      if (method !== "POST" || !/\/users\/login(\?|$)/.test(url)) return original(input, init);
      inflight += 1;
      const started = Date.now();
      showTimer = setTimeout(() => setSince(started), SHOW_AFTER_MS);
      try {
        return await original(input, init);
      } finally {
        inflight -= 1;
        if (!inflight) {
          clearTimeout(showTimer);
          setSince(null);
        }
      }
    };
    return () => {
      window.fetch = original;
      clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!since) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [since]);

  if (!since) return null;
  const left = Math.max(0, Math.ceil((WAIT_MS - (now - since)) / 1000));

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 14,
          padding: "28px 24px",
          textAlign: "center",
          background: "var(--theme-elevation-0)",
          border: "1px solid var(--theme-elevation-150)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1 }}>📲</div>
        <h2 style={{ margin: "14px 0 0", fontSize: 20 }}>Подтвердите вход в Telegram</h2>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--theme-elevation-600)" }}>
          Мы отправили запрос в @{bot}. Откройте чат с ботом и нажмите «✅ Да,&nbsp;это&nbsp;я».
        </p>
        <p style={{ margin: "16px 0 0", fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{left} с</p>
        <a
          href={`https://t.me/${bot}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--style-primary btn--size-medium"
          style={{ display: "inline-flex", margin: "18px 0 0", textDecoration: "none" }}
        >
          Открыть Telegram
        </a>
        <p style={{ margin: "14px 0 0", fontSize: 12, color: "var(--theme-elevation-500)" }}>
          Не нажмёте за 90 секунд — вход не выполнится, нужно будет войти заново.
        </p>
      </div>
    </div>
  );
}

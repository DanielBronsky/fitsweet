"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAuth } from "@payloadcms/ui";

const EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "scroll", "touchstart"] as const;
const ACTIVE_WINDOW_MS = 2 * 60 * 1000;
const REFRESH_BEFORE_MS = 90 * 1000;
const CHECK_EVERY_MS = 10 * 1000;

export function ActivityKeeper({ children }: { children?: ReactNode }) {
  const { user, tokenExpirationMs, refreshCookieAsync } = useAuth();
  const lastActivity = useRef(0);
  const refreshing = useRef(false);

  useEffect(() => {
    lastActivity.current = Date.now();
    const mark = () => {
      lastActivity.current = Date.now();
    };
    for (const e of EVENTS) window.addEventListener(e, mark, { passive: true, capture: true });
    return () => {
      for (const e of EVENTS) window.removeEventListener(e, mark, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!user || !tokenExpirationMs) return;
    const timer = setInterval(async () => {
      const left = tokenExpirationMs - Date.now();
      const active = Date.now() - lastActivity.current < ACTIVE_WINDOW_MS;
      if (left > REFRESH_BEFORE_MS || left <= 0 || !active || refreshing.current) return;
      refreshing.current = true;
      try {
        await refreshCookieAsync();
      } finally {
        refreshing.current = false;
      }
    }, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, [user, tokenExpirationMs, refreshCookieAsync]);

  return <>{children}</>;
}

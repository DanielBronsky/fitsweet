"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getDictionary } from "./index";
import type { Locale } from "./config";
import type { Dictionary } from "./ru";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, dict: getDictionary(locale) }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n должен вызываться внутри <I18nProvider>");
  return ctx;
}

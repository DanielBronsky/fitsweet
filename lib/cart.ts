"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types";

export type CartLine = { id: string; qty: number };

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  addMany: (ids: string[]) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      add: (id, qty = 1) =>
        set((s) => {
          const found = s.lines.find((l) => l.id === id);
          return {
            lines: found
              ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
              : [...s.lines, { id, qty }],
          };
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.id !== id)
              : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        })),

      addMany: (ids) =>
        set((s) => {
          const next = [...s.lines];
          for (const id of ids) {
            const found = next.find((l) => l.id === id);
            if (found) found.qty += 1;
            else next.push({ id, qty: 1 });
          }
          return { lines: next };
        }),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "fitsweet-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.qty, 0);

export const cartTotal = (lines: CartLine[], byId: (id: string) => Product | undefined) =>
  lines.reduce((sum, l) => sum + (byId(l.id)?.price ?? 0) * l.qty, 0);

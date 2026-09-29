"use client";

import { create } from "zustand";
import type { MoodKey } from "./types";

type FilterState = {
  mood: MoodKey | null;
  setMood: (m: MoodKey | null) => void;
};

/** Связывает секцию «Выбирайте по настроению» с каталогом */
export const useMoodFilter = create<FilterState>((set) => ({
  mood: null,
  setMood: (mood) => set({ mood }),
}));

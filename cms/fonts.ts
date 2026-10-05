export const fontGroups = {
  sans: "Без засечек",
  serif: "С засечками",
  hand: "Рукописные",
} as const;

export const fontList = [
  { key: "inter", label: "Inter", family: "Inter", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "manrope", label: "Manrope", family: "Manrope", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "montserrat", label: "Montserrat", family: "Montserrat", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "rubik", label: "Rubik", family: "Rubik", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "nunito", label: "Nunito", family: "Nunito", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "jost", label: "Jost", family: "Jost", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "onest", label: "Onest", family: "Onest", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "comfortaa", label: "Comfortaa", family: "Comfortaa", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "unbounded", label: "Unbounded", family: "Unbounded", group: "sans", fallback: "system-ui, sans-serif" },
  { key: "noto-display", label: "Noto Serif Display", family: "Noto Serif Display", group: "serif", fallback: "Georgia, serif" },
  { key: "cormorant-light", label: "Cormorant", family: "Cormorant", group: "serif", fallback: "Georgia, serif" },
  { key: "playfair-new", label: "Playfair (новый)", family: "Playfair", group: "serif", fallback: "Georgia, serif" },
  { key: "playfair", label: "Playfair Display", family: "Playfair Display", group: "serif", fallback: "Georgia, serif" },
  { key: "cormorant", label: "Cormorant Garamond", family: "Cormorant Garamond", group: "serif", fallback: "Georgia, serif" },
  { key: "lora", label: "Lora", family: "Lora", group: "serif", fallback: "Georgia, serif" },
  { key: "pt-serif", label: "PT Serif", family: "PT Serif", group: "serif", fallback: "Georgia, serif" },
  { key: "yeseva", label: "Yeseva One", family: "Yeseva One", group: "serif", fallback: "Georgia, serif" },
  { key: "caveat", label: "Caveat", family: "Caveat", group: "hand", fallback: "cursive" },
  { key: "marck", label: "Marck Script", family: "Marck Script", group: "hand", fallback: "cursive" },
  { key: "lobster", label: "Lobster", family: "Lobster", group: "hand", fallback: "cursive" },
] as const satisfies readonly { key: string; label: string; family: string; group: keyof typeof fontGroups; fallback: string }[];

export type FontKey = (typeof fontList)[number]["key"];

const byKey = new Map<string, (typeof fontList)[number]>(fontList.map((f) => [f.key, f]));

export const isFontKey = (value: unknown): value is FontKey => typeof value === "string" && byKey.has(value);

export function fontToCss(key: string | null | undefined): string | undefined {
  const font = key ? byKey.get(key) : undefined;
  return font ? `var(--font-${font.key}), ${font.fallback}` : undefined;
}

export const fontWeights = [
  { value: "300", label: "Тонкий" },
  { value: "400", label: "Обычный" },
  { value: "500", label: "Средний" },
  { value: "600", label: "Полужирный" },
  { value: "700", label: "Жирный" },
] as const;

export const isFontWeight = (value: unknown): boolean => fontWeights.some((w) => w.value === value);

/**
 * Палитра бренда — общий источник для сайта и админки.
 * HEX по умолчанию совпадают с @theme в app/(site)/globals.css;
 * в админке («Оформление → Палитра») их можно переопределить.
 */
export const paletteTokens = [
  { key: "cream", label: "Кремовый — фон страницы", hex: "#faf8f3" },
  { key: "beige", label: "Бежевый — фон секций", hex: "#f1ece1" },
  { key: "card", label: "Подложка карточек", hex: "#f7f5f0" },
  { key: "sage", label: "Шалфей — фон фото", hex: "#dfe4d2" },
  { key: "white", label: "Белый", hex: "#ffffff" },
  { key: "green-900", label: "Тёмно-зелёный — заголовки", hex: "#2d3526" },
  { key: "green-700", label: "Зелёный — кнопки, лого", hex: "#6b7a52" },
  { key: "green-500", label: "Светло-зелёный — акценты", hex: "#9dab80" },
  { key: "green-200", label: "Бледно-зелёный — обводки", hex: "#cdd6bc" },
  { key: "olive", label: "Оливковый — финальный CTA", hex: "#8a9670" },
  { key: "choco", label: "Шоколадный", hex: "#4a3122" },
  { key: "muted", label: "Серый — подписи", hex: "#7c7a70" },
  { key: "blush", label: "Розовый", hex: "#efc8d8" },
] as const;

export type PaletteKey = (typeof paletteTokens)[number]["key"];
export type Palette = Record<PaletteKey, string>;

export const defaultPalette = Object.fromEntries(
  paletteTokens.map((t) => [t.key, t.hex]),
) as Palette;

export const HEX_RE = /^#[0-9a-f]{6}$/i;

const paletteKeys = new Set<string>(paletteTokens.map((t) => t.key));

/**
 * Значение цветового поля из админки → CSS.
 * Хранится либо ключ палитры («green-700»), либо свой HEX («#aabbcc»).
 * Ключ палитры отдаём как CSS-переменную — тогда смена палитры
 * перекрашивает все элементы, где выбран этот цвет.
 */
export function colorToCss(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (HEX_RE.test(value)) return value;
  if (paletteKeys.has(value)) return `var(--color-${value})`;
  return undefined;
}

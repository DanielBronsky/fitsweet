/**
 * Рамки кропера. Общий модуль для админки (клиент) и генерации файлов (сервер) —
 * без node-зависимостей.
 */

export const cropKinds = ["desktop", "mobile", "og"] as const;
export type CropKind = (typeof cropKinds)[number];

/** Прямоугольник в процентах от исходной картинки (0–100) */
export type CropRect = { x: number; y: number; width: number; height: number };
export type CropFrame = CropRect & { aspect: string };
export type Crops = Record<CropKind, CropFrame>;

export const cropLabels: Record<CropKind, string> = {
  desktop: "Десктоп",
  mobile: "Мобилка",
  og: "Соцсети",
};

/** Доступные пропорции. «og» фиксирован: 1200×630 — стандарт превью ссылок */
export const aspectOptions: Record<CropKind, string[]> = {
  desktop: ["6:5", "4:3", "3:2", "16:9", "1:1", "4:5", "3:4"],
  mobile: ["4:5", "1:1", "3:4", "6:5", "4:3", "16:9", "9:16"],
  og: ["40:21"],
};

export const defaultAspect: Record<CropKind, string> = {
  desktop: "6:5",
  mobile: "4:5",
  og: "40:21",
};

export function parseAspect(aspect: string): number {
  const [w, h] = aspect.split(":").map(Number);
  return w > 0 && h > 0 ? w / h : 1;
}

/** Максимальная рамка нужной пропорции по центру картинки */
export function centeredCrop(imgW: number, imgH: number, aspect: string): CropFrame {
  const ratio = parseAspect(aspect);
  let w = imgW;
  let h = w / ratio;
  if (h > imgH) {
    h = imgH;
    w = h * ratio;
  }
  return {
    aspect,
    x: ((imgW - w) / 2 / imgW) * 100,
    y: ((imgH - h) / 2 / imgH) * 100,
    width: (w / imgW) * 100,
    height: (h / imgH) * 100,
  };
}

export function defaultCrops(imgW: number, imgH: number): Crops {
  return {
    desktop: centeredCrop(imgW, imgH, defaultAspect.desktop),
    mobile: centeredCrop(imgW, imgH, defaultAspect.mobile),
    og: centeredCrop(imgW, imgH, defaultAspect.og),
  };
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Проверка и нормализация того, что пришло из формы */
export function normalizeCrops(value: unknown, imgW: number, imgH: number): Crops {
  const fallback = defaultCrops(imgW, imgH);
  if (!value || typeof value !== "object") return fallback;
  const src = value as Partial<Record<CropKind, Partial<CropFrame>>>;

  const out = {} as Crops;
  for (const kind of cropKinds) {
    const f = src[kind];
    const aspect =
      f?.aspect && aspectOptions[kind].includes(f.aspect) ? f.aspect : defaultAspect[kind];
    if (f && isNum(f.x) && isNum(f.y) && isNum(f.width) && isNum(f.height) && f.width > 0 && f.height > 0) {
      const x = Math.min(Math.max(f.x, 0), 100);
      const y = Math.min(Math.max(f.y, 0), 100);
      out[kind] = {
        aspect,
        x,
        y,
        width: Math.min(f.width, 100 - x),
        height: Math.min(f.height, 100 - y),
      };
    } else {
      out[kind] = centeredCrop(imgW, imgH, aspect);
    }
  }
  return out;
}

/** Нарезанные файлы, которые сохраняются в документе медиа */
export type VariantSet = {
  /** Размер вырезанной области исходника, px — для width/height у <img> */
  width: number;
  height: number;
  srcset: { w: number; src: string }[];
};

export type MediaVariants = {
  desktop: VariantSet;
  mobile: VariantSet;
  og: { src: string; width: number; height: number };
};

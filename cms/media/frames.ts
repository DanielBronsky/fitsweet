export type FrameOutput =
  | { type: "responsive"; widths: number[] }
  | { type: "fixed"; width: number; height: number; format: "jpg" };

export type FrameSpec = {
  key: string;
  label: string;
  hint: string;
  aspect: [number, number];
  minWidth: number;
  output: FrameOutput;
};

export type CropRect = { x: number; y: number; width: number; height: number };
export type Crops = Record<string, CropRect>;

export type ResponsiveVariant = {
  type: "responsive";
  width: number;
  height: number;
  srcset: { w: number; src: string }[];
};

export type FixedVariant = { type: "fixed"; src: string; width: number; height: number };

export type ImageVariants = {
  mediaId: number;
  source: string;
  frames: Record<string, ResponsiveVariant | FixedVariant>;
};

const desktop = (aspect: [number, number]): FrameSpec => ({
  key: "desktop",
  label: "Десктоп",
  hint: "Как картинка выглядит на компьютере.",
  aspect,
  minWidth: 1280,
  output: { type: "responsive", widths: [640, 960, 1280, 1920] },
});

const mobile = (aspect: [number, number]): FrameSpec => ({
  key: "mobile",
  label: "Мобилка",
  hint: "Как картинка выглядит на телефоне.",
  aspect,
  minWidth: 750,
  output: { type: "responsive", widths: [480, 750, 1080] },
});

export const framePresets = {
  hero: [desktop([6, 5]), mobile([1, 1])],
  productCard: [
    {
      key: "card",
      label: "Карточка",
      hint: "Квадратное фото товара в каталоге, корзине и конструкторе коробки.",
      aspect: [1, 1],
      minWidth: 480,
      output: { type: "responsive", widths: [240, 360, 480, 720] },
    },
  ],
  moodCard: [
    {
      key: "card",
      label: "Карточка",
      hint: "Картинка в карточке настроения.",
      aspect: [13, 11],
      minWidth: 440,
      output: { type: "responsive", widths: [300, 440, 660] },
    },
  ],
  og: [
    {
      key: "og",
      label: "Соцсети",
      hint: "Превью ссылки в Telegram, Facebook, Viber.",
      aspect: [40, 21],
      minWidth: 1200,
      output: { type: "fixed", width: 1200, height: 630, format: "jpg" },
    },
  ],
} satisfies Record<string, FrameSpec[]>;

export const aspectRatio = (spec: FrameSpec) => spec.aspect[0] / spec.aspect[1];

export const aspectLabel = (spec: FrameSpec) =>
  spec.output.type === "fixed" ? `${spec.output.width}×${spec.output.height}` : `${spec.aspect[0]}:${spec.aspect[1]}`;

export function centeredCrop(imgW: number, imgH: number, ratio: number): CropRect {
  let w = imgW;
  let h = w / ratio;
  if (h > imgH) {
    h = imgH;
    w = h * ratio;
  }
  return {
    x: ((imgW - w) / 2 / imgW) * 100,
    y: ((imgH - h) / 2 / imgH) * 100,
    width: (w / imgW) * 100,
    height: (h / imgH) * 100,
  };
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

function fitAspect(rect: CropRect, ratio: number, imgW: number, imgH: number): CropRect {
  const x = Math.min(Math.max(rect.x, 0), 99);
  const y = Math.min(Math.max(rect.y, 0), 99);
  let width = Math.min(rect.width, 100 - x);
  let height = (width * imgW) / ratio / imgH;
  if (y + height > 100) {
    height = 100 - y;
    width = (height * imgH * ratio) / imgW;
  }
  return { x, y, width, height };
}

export function normalizeCrops(value: unknown, frames: FrameSpec[], imgW: number, imgH: number): Crops {
  const src = (value && typeof value === "object" ? value : {}) as Record<string, Partial<CropRect>>;
  const out: Crops = {};
  for (const spec of frames) {
    const f = src[spec.key];
    const ratio = aspectRatio(spec);
    out[spec.key] =
      f && isNum(f.x) && isNum(f.y) && isNum(f.width) && isNum(f.height) && f.width > 0 && f.height > 0
        ? fitAspect({ x: f.x, y: f.y, width: f.width, height: f.height }, ratio, imgW, imgH)
        : centeredCrop(imgW, imgH, ratio);
  }
  return out;
}

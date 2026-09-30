"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FieldLabel, useField, useFormFields } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import {
  aspectOptions,
  cropKinds,
  cropLabels,
  defaultCrops,
  normalizeCrops,
  parseAspect,
  type CropFrame,
  type CropKind,
  type Crops,
} from "../media/crops";

const hints: Record<CropKind, string> = {
  desktop: "Как картинка выглядит на компьютере.",
  mobile: "Как картинка выглядит на телефоне — обычно вертикальнее.",
  og: "Превью ссылки в Telegram, Facebook, Viber (1200×630).",
};

/**
 * Кропер с тремя рамками: Десктоп / Мобилка / Соцсети.
 * Хранит рамки в процентах от исходника; файлы режет сервер (cms/collections/Media.ts).
 */
export const CropperField: JSONFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<Crops | null>({ path });

  // Только что выбранный файл (ещё не сохранён) или уже загруженный
  const file = useFormFields(([fields]) => fields.file?.value) as File | undefined;
  const savedUrl = useFormFields(([fields]) => fields.url?.value) as string | undefined;

  const localUrl = useMemo(() => (file instanceof File ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    },
    [localUrl],
  );

  const src = localUrl ?? savedUrl ?? null;

  // Натуральный размер картинки — привязан к src, чтобы не смешать с предыдущим файлом
  const [loaded, setLoaded] = useState<{ src: string; w: number; h: number } | null>(null);
  useEffect(() => {
    if (!src) return;
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (alive) setLoaded({ src, w: img.naturalWidth || 1000, h: img.naturalHeight || 1000 });
    };
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);
  const natural = loaded && loaded.src === src ? loaded : null;

  // Новый файл → старые рамки не подходят, ставим по центру
  useEffect(() => {
    if (localUrl && natural) setValue(defaultCrops(natural.w, natural.h));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUrl, natural]);

  const crops = useMemo(
    () => (natural ? normalizeCrops(value, natural.w, natural.h) : null),
    [value, natural],
  );

  const [kind, setKind] = useState<CropKind>("desktop");

  const update = useCallback(
    (k: CropKind, frame: CropFrame) => {
      if (!crops) return;
      setValue({ ...crops, [k]: frame });
    },
    [crops, setValue],
  );

  const label = typeof field.label === "string" ? field.label : "Обрезка";

  if (!src || !natural || !crops) {
    return (
      <div className="field-type" style={{ marginBottom: 24 }}>
        <FieldLabel label={label} path={path} />
        <p style={{ color: "var(--theme-elevation-500)" }}>
          Загрузите картинку — здесь появятся рамки для десктопа, мобилки и соцсетей.
        </p>
      </div>
    );
  }

  return (
    <div className="field-type" style={{ marginBottom: 32 }}>
      <FieldLabel label={label} path={path} />

      <div style={{ display: "flex", gap: 8, margin: "8px 0 12px", flexWrap: "wrap" }}>
        {cropKinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            style={tabStyle(k === kind)}
          >
            {cropLabels[k]}
          </button>
        ))}
      </div>

      <FrameEditor
        key={`${kind}-${src}`}
        src={src}
        kind={kind}
        frame={crops[kind]}
        natural={natural}
        onChange={(f) => update(kind, f)}
      />

      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        {cropKinds.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            style={{ all: "unset", cursor: "pointer", textAlign: "center" }}
            title={`Редактировать: ${cropLabels[k]}`}
          >
            <Preview src={src} frame={crops[k]} height={k === "mobile" ? 140 : 100} active={k === kind} />
            <div style={{ fontSize: 12, marginTop: 4 }}>
              {cropLabels[k]} · {k === "og" ? "1200×630" : crops[k].aspect}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

function FrameEditor({
  src,
  kind,
  frame,
  natural,
  onChange,
}: {
  src: string;
  kind: CropKind;
  frame: CropFrame;
  natural: { w: number; h: number };
  onChange: (frame: CropFrame) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(frame.aspect);
  // Начальная рамка — из сохранённых процентов; при смене пропорции — заново по центру
  const [initial] = useState<Area>({ x: frame.x, y: frame.y, width: frame.width, height: frame.height });

  const lowRes = (frame.width / 100) * natural.w < (kind === "og" ? 1200 : kind === "desktop" ? 1280 : 750);

  return (
    <div>
      {aspectOptions[kind].length > 1 && (
        <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          Пропорция
          <select
            value={aspect}
            onChange={(e) => {
              setAspect(e.target.value);
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
            style={{ padding: "4px 8px" }}
          >
            {aspectOptions[kind].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      )}
      <p style={{ margin: "0 0 10px", color: "var(--theme-elevation-500)" }}>
        {hints[kind]} Перетаскивайте картинку, колесо мыши или ползунок — масштаб.
      </p>

      <div style={{ position: "relative", height: 420, background: "#222", borderRadius: 8, overflow: "hidden" }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          maxZoom={6}
          aspect={parseAspect(aspect)}
          initialCroppedAreaPercentages={aspect === frame.aspect ? initial : undefined}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(area) => {
            // Cropper сообщает рамку и при открытии — не помечаем форму изменённой зря
            const same =
              aspect === frame.aspect &&
              Math.abs(area.x - frame.x) < 0.05 &&
              Math.abs(area.y - frame.y) < 0.05 &&
              Math.abs(area.width - frame.width) < 0.05 &&
              Math.abs(area.height - frame.height) < 0.05;
            if (!same) onChange({ aspect, ...area });
          }}
          objectFit="contain"
        />
      </div>

      <input
        type="range"
        min={1}
        max={6}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        style={{ width: "100%", marginTop: 10 }}
        aria-label="Масштаб"
      />

      {lowRes && (
        <p style={{ color: "var(--theme-warning-500)", margin: "6px 0 0" }}>
          ⚠️ Выбранная область меньше рекомендуемой ширины — на больших экранах картинка может быть нечёткой.
        </p>
      )}
    </div>
  );
}

/** Превью рамки чистым CSS — без повторной загрузки файла */
function Preview({ src, frame, height, active }: { src: string; frame: CropFrame; height: number; active: boolean }) {
  const width = height * parseAspect(frame.aspect);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: 6,
        outline: active ? "2px solid var(--theme-success-500)" : "1px solid var(--theme-elevation-150)",
        background: "#eee",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          maxWidth: "none",
          width: `${(100 / frame.width) * 100}%`,
          height: `${(100 / frame.height) * 100}%`,
          left: `${(-frame.x / frame.width) * 100}%`,
          top: `${(-frame.y / frame.height) * 100}%`,
        }}
      />
    </div>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: 999,
    border: "1px solid var(--theme-elevation-200)",
    background: active ? "var(--theme-elevation-800)" : "transparent",
    color: active ? "var(--theme-elevation-0)" : "inherit",
    cursor: "pointer",
  };
}

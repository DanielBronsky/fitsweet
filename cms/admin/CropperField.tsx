"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FieldLabel, useConfig, useField, useFormFields } from "@payloadcms/ui";
import type { JSONFieldClientComponent } from "payload";
import { aspectLabel, aspectRatio, normalizeCrops, type CropRect, type Crops, type FrameSpec } from "../media/frames";

type MediaInfo = { id: number; url: string; mimeType?: string };

export const CropperField: JSONFieldClientComponent = (props) => {
  const { path, field } = props;
  const frames = (props as unknown as { frames: FrameSpec[] }).frames;
  const { value, setValue } = useField<Crops | null>({ path });
  const { config } = useConfig();

  const imagePath = path.replace(/crops$/, "image");
  const rawImage = useFormFields(([fields]) => fields[imagePath]?.value) as number | { id: number } | null | undefined;
  const mediaId = rawImage && typeof rawImage === "object" ? rawImage.id : (rawImage ?? null);

  const initialMedia = useRef(mediaId);
  useEffect(() => {
    if (mediaId !== initialMedia.current) {
      initialMedia.current = mediaId;
      setValue(null);
    }
  }, [mediaId, setValue]);

  const [media, setMedia] = useState<MediaInfo | null>(null);
  useEffect(() => {
    if (!mediaId) return;
    let alive = true;
    fetch(`${config.serverURL}${config.routes.api}/media/${mediaId}?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (alive && doc?.url) setMedia({ id: doc.id, url: doc.url, mimeType: doc.mimeType });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [mediaId, config.serverURL, config.routes.api]);

  const current = media && media.id === mediaId ? media : null;
  const src = current?.url ?? null;
  const isVector = current?.mimeType === "image/svg+xml";

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

  const crops = useMemo(
    () => (natural ? normalizeCrops(value, frames, natural.w, natural.h) : null),
    [value, frames, natural],
  );

  const [activeKey, setActiveKey] = useState(frames[0].key);
  const active = frames.find((f) => f.key === activeKey) ?? frames[0];
  const label = typeof field.label === "string" ? field.label : "Обрезка";

  if (!mediaId) {
    return (
      <div className="field-type" style={{ marginBottom: 24 }}>
        <FieldLabel label={label} path={path} />
        <p style={{ color: "var(--theme-elevation-500)" }}>
          Выберите картинку выше — здесь появится рамка: {frames.map((f) => `${f.label} ${aspectLabel(f)}`).join(", ")}.
        </p>
      </div>
    );
  }

  if (!src || !natural || !crops) {
    return (
      <div className="field-type" style={{ marginBottom: 24 }}>
        <FieldLabel label={label} path={path} />
        <p style={{ color: "var(--theme-elevation-500)" }}>Загружаю картинку…</p>
      </div>
    );
  }

  return (
    <div className="field-type" style={{ marginBottom: 32 }}>
      <FieldLabel label={label} path={path} />

      {frames.length > 1 && (
        <div style={{ display: "flex", gap: 8, margin: "8px 0 12px", flexWrap: "wrap" }}>
          {frames.map((f) => (
            <button key={f.key} type="button" onClick={() => setActiveKey(f.key)} style={tabStyle(f.key === active.key)}>
              {f.label} · {aspectLabel(f)}
            </button>
          ))}
        </div>
      )}

      <FrameEditor
        key={`${active.key}-${src}`}
        src={src}
        spec={active}
        rect={crops[active.key]}
        natural={natural}
        isVector={isVector}
        onChange={(rect) => setValue({ ...crops, [active.key]: rect })}
      />

      {frames.length > 1 && (
        <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
          {frames.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveKey(f.key)}
              style={{ all: "unset", cursor: "pointer", textAlign: "center" }}
              title={`Редактировать: ${f.label}`}
            >
              <Preview src={src} spec={f} rect={crops[f.key]} height={120} active={f.key === active.key} />
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {f.label} · {aspectLabel(f)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function FrameEditor({
  src,
  spec,
  rect,
  natural,
  isVector,
  onChange,
}: {
  src: string;
  spec: FrameSpec;
  rect: CropRect;
  natural: { w: number; h: number };
  isVector: boolean;
  onChange: (rect: CropRect) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [initial] = useState<Area>(rect);

  const pickedWidth = Math.round((rect.width / 100) * natural.w);
  const lowRes = !isVector && pickedWidth < spec.minWidth;

  return (
    <div>
      <p style={{ margin: "0 0 10px", color: "var(--theme-elevation-500)" }}>
        {spec.hint} Перетаскивайте картинку, колесо мыши или ползунок — масштаб.
      </p>

      <div style={{ position: "relative", height: 420, background: "#222", borderRadius: 8, overflow: "hidden" }}>
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          maxZoom={6}
          aspect={aspectRatio(spec)}
          initialCroppedAreaPercentages={initial}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(area) => {
            const same =
              Math.abs(area.x - rect.x) < 0.05 &&
              Math.abs(area.y - rect.y) < 0.05 &&
              Math.abs(area.width - rect.width) < 0.05 &&
              Math.abs(area.height - rect.height) < 0.05;
            if (!same) onChange(area);
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
          ⚠️ В рамку попадает {pickedWidth} px по ширине, а для «{spec.label}» нужно от {spec.minWidth} px — картинка
          может быть нечёткой. Уменьшите масштаб или загрузите исходник побольше.
        </p>
      )}
    </div>
  );
}

function Preview({
  src,
  spec,
  rect,
  height,
  active,
}: {
  src: string;
  spec: FrameSpec;
  rect: CropRect;
  height: number;
  active: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: height * aspectRatio(spec),
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
          width: `${(100 / rect.width) * 100}%`,
          height: `${(100 / rect.height) * 100}%`,
          left: `${(-rect.x / rect.width) * 100}%`,
          top: `${(-rect.y / rect.height) * 100}%`,
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

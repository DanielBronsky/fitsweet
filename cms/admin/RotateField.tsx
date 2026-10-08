"use client";

import { FieldLabel, useDocumentInfo, useField, useFormFields } from "@payloadcms/ui";
import type { NumberFieldClientComponent } from "payload";

const names: Record<number, string> = { 90: "вправо на 90°", 180: "на 180°", 270: "влево на 90°" };

export const RotateField: NumberFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<number | null>({ path });
  const url = useFormFields(([fields]) => (fields.thumbnailURL?.value || fields.url?.value) as string | undefined);
  const mime = useFormFields(([fields]) => fields.mimeType?.value as string | undefined);
  const { id } = useDocumentInfo();

  if (!id || !url) return null;
  if (mime === "image/svg+xml") return null;

  const angle = value ?? 0;
  const turn = (delta: number) => {
    const next = (((angle + delta) % 360) + 360) % 360;
    setValue(next === 0 ? null : next);
  };

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <FieldLabel label="Поворот фото" path={path} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
        <div
          style={{
            width: 120,
            height: 120,
            display: "grid",
            placeItems: "center",
            background: "var(--theme-elevation-50)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            style={{ maxWidth: 100, maxHeight: 100, transform: `rotate(${angle}deg)`, transition: "transform .2s" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => turn(-90)} style={{ margin: 0 }}>
              ↺ Повернуть влево
            </button>
            <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => turn(90)} style={{ margin: 0 }}>
              ↻ Повернуть вправо
            </button>
          </div>
          <span style={{ fontSize: 13, color: "var(--theme-elevation-500)" }}>
            {angle
              ? `Фото будет повёрнуто ${names[angle]} после «Сохранить». Нарезка во всех разделах обновится сама.`
              : "Поворачивает сам исходник. Нужно, если фото пришло боком."}
          </span>
        </div>
      </div>
    </div>
  );
};

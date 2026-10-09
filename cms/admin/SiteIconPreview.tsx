"use client";

import { useField } from "@payloadcms/ui";
import type { UIFieldClientComponent } from "payload";

export const SiteIconPreview: UIFieldClientComponent = ({ path }) => {
  const image = useField<unknown>({ path: path.replace(/[^.]+$/, "image") });
  const saved = useField<{ icon?: string } | null>({ path: path.replace(/[^.]+$/, "variants") });
  const custom = Boolean(image.value);
  const version = saved.value?.icon ?? "default";
  const src = (file: string) => `/site-icon/${file}?v=${encodeURIComponent(version)}`;

  return (
    <div className="field-type" style={{ marginBottom: 20 }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--theme-elevation-500)" }}>Сейчас на сайте:</p>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src("icon.png")} alt="" width={64} height={64} style={{ borderRadius: 12 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src("favicon.ico")} alt="" width={32} height={32} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src("favicon.ico")} alt="" width={16} height={16} />
        <span style={{ fontSize: 13, color: "var(--theme-elevation-600)" }}>
          {custom ? "Ваша иконка. Новая картинка применится после сохранения." : "Стандартная иконка FitSweet (из визитки). Загрузите картинку ниже, чтобы заменить."}
        </span>
      </div>
    </div>
  );
};

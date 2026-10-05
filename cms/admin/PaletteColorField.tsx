"use client";

import { useEffect, useState } from "react";
import { FieldError, FieldLabel, useConfig, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { HEX_RE, defaultPalette, paletteTokens, type Palette } from "../palette";

export const PaletteColorField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue, showError } = useField<string>({ path });
  const { config } = useConfig();
  const [palette, setPalette] = useState<Palette>(defaultPalette);

  useEffect(() => {
    let alive = true;
    fetch(`${config.serverURL}${config.routes.api}/globals/theme?depth=0`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!alive || !doc?.colors) return;
        const next = { ...defaultPalette };
        for (const t of paletteTokens) {
          const hex = doc.colors[t.key.replace("-", "_")];
          if (typeof hex === "string" && HEX_RE.test(hex)) next[t.key] = hex;
        }
        setPalette(next);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [config.serverURL, config.routes.api]);

  const label = typeof field.label === "string" ? field.label : field.name;
  const isCustom = Boolean(value && HEX_RE.test(value));

  return (
    <div className="field-type" style={{ marginBottom: 20 }}>
      <FieldLabel label={label} path={path} required={field.required} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {paletteTokens.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              title={t.label}
              aria-label={t.label}
              aria-pressed={active}
              onClick={() => setValue(t.key)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: palette[t.key],
                border: "1px solid rgba(0,0,0,.15)",
                outline: active ? "2px solid var(--theme-elevation-800)" : "none",
                outlineOffset: 2,
                cursor: "pointer",
              }}
            />
          );
        })}

        <label
          title="Свой цвет"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8, cursor: "pointer" }}
        >
          <input
            type="color"
            value={isCustom ? value : "#000000"}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: 30,
              height: 30,
              padding: 0,
              border: "1px solid rgba(0,0,0,.15)",
              borderRadius: "50%",
              outline: isCustom ? "2px solid var(--theme-elevation-800)" : "none",
              outlineOffset: 2,
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: 13 }}>Свой</span>
        </label>

        {value && !field.required && (
          <button
            type="button"
            onClick={() => setValue(null)}
            style={{ all: "unset", fontSize: 13, textDecoration: "underline", cursor: "pointer", marginLeft: 8 }}
          >
            По умолчанию
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, marginTop: 6, color: "var(--theme-elevation-500)" }}>
        {value
          ? isCustom
            ? `Свой цвет: ${value}`
            : paletteTokens.find((t) => t.key === value)?.label
          : "Цвет по умолчанию из дизайна"}
      </div>
      {showError && <FieldError path={path} showError />}
    </div>
  );
};

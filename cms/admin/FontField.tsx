"use client";

import { useEffect, useState } from "react";
import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { fontGroups, fontList } from "../fonts";

const LINK_ID = "fitsweet-admin-fonts";

function useFontPreviews() {
  useEffect(() => {
    if (document.getElementById(LINK_ID)) return;
    const families = fontList.map((f) => `family=${f.family.replace(/ /g, "+")}`).join("&");
    const link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families}&subset=cyrillic,latin-ext&display=swap`;
    document.head.appendChild(link);
  }, []);
}

export const FontField: TextFieldClientComponent = (props) => {
  const { path, field } = props;
  const allowInherit = (props as unknown as { allowInherit?: boolean }).allowInherit ?? true;
  const { value, setValue, showError } = useField<string>({ path });
  const [open, setOpen] = useState(!allowInherit);
  useFontPreviews();
  const current = fontList.find((f) => f.key === value);

  const label = typeof field.label === "string" ? field.label : field.name;
  const description = typeof field.admin?.description === "string" ? field.admin.description : undefined;

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <FieldLabel label={label} path={path} required={field.required} />
      {description && <FieldDescription description={description} path={path} />}

      {allowInherit && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: current ? `"${current.family}", ${current.fallback}` : undefined,
              fontSize: current ? 18 : 14,
            }}
          >
            {current ? `${current.label} — Десерты · Deserturi` : "Как в оформлении"}
          </span>
          <button type="button" onClick={() => setOpen((o) => !o)} style={linkButton}>
            {open ? "Свернуть" : "Выбрать шрифт"}
          </button>
          {value && (
            <button type="button" onClick={() => setValue(null)} style={linkButton}>
              Как в оформлении
            </button>
          )}
        </div>
      )}

      {open && (Object.keys(fontGroups) as (keyof typeof fontGroups)[]).map((group) => (
        <div key={group} style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)", marginBottom: 6 }}>
            {fontGroups[group]}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 8 }}>
            {fontList
              .filter((f) => f.group === group)
              .map((f) => (
                <button key={f.key} type="button" onClick={() => setValue(f.key)} style={cardStyle(value === f.key)} title={f.label}>
                  <span style={{ fontFamily: `"${f.family}", ${f.fallback}`, fontSize: 22, lineHeight: 1.2 }}>Десерты</span>
                  <span style={{ fontFamily: `"${f.family}", ${f.fallback}`, fontSize: 14 }}>Deserturi ă ș ț</span>
                  <span style={{ fontSize: 11, color: "var(--theme-elevation-500)" }}>{f.label}</span>
                </button>
              ))}
          </div>
        </div>
      ))}

      {showError && <FieldError path={path} showError />}
    </div>
  );
};

const linkButton: React.CSSProperties = {
  all: "unset",
  fontSize: 13,
  textDecoration: "underline",
  cursor: "pointer",
};

function cardStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    padding: "10px 12px",
    textAlign: "left",
    borderRadius: 8,
    border: active ? "2px solid var(--theme-elevation-800)" : "1px solid var(--theme-elevation-150)",
    background: active ? "var(--theme-elevation-50)" : "var(--theme-input-bg)",
    color: "inherit",
    cursor: "pointer",
  };
}

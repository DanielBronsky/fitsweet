"use client";

import { useMemo, useState } from "react";
import { FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { iconDef, iconGroups, iconList } from "../icons";

export const IconField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue, showError } = useField<string>({ path });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = value === "custom" ? null : iconDef(value);
  const label = typeof field.label === "string" ? field.label : "Иконка";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? iconList.filter((i) => i.label.toLowerCase().includes(q)) : iconList;
  }, [query]);

  return (
    <div className="field-type" style={{ marginBottom: 20 }}>
      <FieldLabel label={label} path={path} required={field.required} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
        <div style={previewBox}>
          {value === "custom" ? (
            <span style={{ fontSize: 11, textAlign: "center", color: "var(--theme-elevation-500)" }}>своя картинка</span>
          ) : (
            <SiteIcon name={value || "tasty"} style={{ width: 40, height: 40, color: "var(--theme-elevation-800)" }} />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <strong style={{ fontWeight: 500 }}>{value === "custom" ? "Своя картинка" : (current?.label ?? "Не выбрана")}</strong>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} onClick={() => setOpen((o) => !o)}>
              {open ? "Свернуть" : "Выбрать иконку"}
            </button>
            <button
              type="button"
              className="btn btn--style-secondary btn--size-small"
              style={{ margin: 0 }}
              onClick={() => {
                setValue("custom");
                setOpen(false);
              }}
            >
              Загрузить свою
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, padding: 14, border: "1px solid var(--theme-elevation-150)", borderRadius: 8 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: сахар, орех, доставка…"
            style={{
              width: "100%",
              padding: "8px 12px",
              marginBottom: 12,
              border: "1px solid var(--theme-elevation-150)",
              borderRadius: 6,
              background: "var(--theme-input-bg)",
              color: "inherit",
            }}
          />
          {(Object.keys(iconGroups) as (keyof typeof iconGroups)[]).map((group) => {
            const items = filtered.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group} style={{ marginBottom: 12 }}>
                <div style={groupTitle}>{iconGroups[group]}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 6 }}>
                  {items.map((icon) => (
                    <button
                      key={icon.key}
                      type="button"
                      title={icon.label}
                      onClick={() => {
                        setValue(icon.key);
                        setOpen(false);
                      }}
                      style={tile(value === icon.key)}
                    >
                      <SiteIcon name={icon.key} style={{ width: 28, height: 28 }} />
                      <span style={{ fontSize: 10.5, lineHeight: 1.2, textAlign: "center" }}>{icon.label.split(",")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p style={{ margin: 0, color: "var(--theme-elevation-500)" }}>Ничего не найдено</p>}
        </div>
      )}

      {showError && <FieldError path={path} showError />}
    </div>
  );
};

const previewBox: React.CSSProperties = {
  width: 72,
  height: 72,
  display: "grid",
  placeItems: "center",
  borderRadius: 10,
  border: "1px solid var(--theme-elevation-150)",
  background: "var(--theme-elevation-50)",
};

const groupTitle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--theme-elevation-500)",
  marginBottom: 6,
};

function tile(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "10px 4px",
    borderRadius: 8,
    border: active ? "2px solid var(--theme-elevation-800)" : "1px solid var(--theme-elevation-150)",
    background: active ? "var(--theme-elevation-100)" : "transparent",
    color: "inherit",
    cursor: "pointer",
  };
}

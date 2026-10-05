"use client";

import { FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { HEX_RE } from "../palette";

export const HexColorField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue, showError } = useField<string>({ path });
  const label = typeof field.label === "string" ? field.label : field.name;
  const valid = Boolean(value && HEX_RE.test(value));

  return (
    <div className="field-type" style={{ marginBottom: 16 }}>
      <FieldLabel label={label} path={path} required={field.required} />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="color"
          value={valid ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          aria-label={label}
          style={{ width: 44, height: 36, padding: 0, border: "1px solid var(--theme-elevation-150)", borderRadius: 6, cursor: "pointer" }}
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="#aabbcc"
          maxLength={7}
          style={{ width: 110, fontFamily: "monospace", padding: "8px 10px", border: "1px solid var(--theme-elevation-150)", borderRadius: 6, background: "var(--theme-input-bg)", color: "inherit" }}
        />
      </div>
      {showError && <FieldError path={path} showError />}
    </div>
  );
};

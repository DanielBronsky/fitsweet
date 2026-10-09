"use client";

import { FieldDescription, FieldError, FieldLabel, useField } from "@payloadcms/ui";
import type { SelectFieldClientComponent } from "payload";
import { sectionAnchors } from "../fields/link";
import { useCustomSections } from "./useCustomSections";

export const LinkTargetField: SelectFieldClientComponent = ({ path, field }) => {
  const target = useField<string>({ path });
  const section = useField<number | null>({ path: path.replace(/target$/, "section") });
  const sections = useCustomSections();

  const sectionId = typeof section.value === "object" && section.value ? (section.value as { id: number }).id : section.value;
  const current = target.value === "section" && sectionId ? `section:${sectionId}` : (target.value ?? "");

  const onChange = (value: string) => {
    if (value.startsWith("section:")) {
      target.setValue("section");
      section.setValue(Number(value.slice(8)));
    } else {
      target.setValue(value);
      section.setValue(null);
    }
  };

  const label = typeof field.label === "string" ? field.label : "Куда ведёт";

  return (
    <div className="field-type" style={{ marginBottom: 16, flex: "1 1 50%" }}>
      <FieldLabel label={label} path={path} required={field.required} />
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 40,
          padding: "0 12px",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: 4,
          background: "var(--theme-input-bg)",
          color: "inherit",
          fontSize: 14,
        }}
      >
        {!current && <option value="">Выберите…</option>}
        <optgroup label="Раздел страницы">
          {sectionAnchors.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
          {sections.map((s) => (
            <option key={s.id} value={`section:${s.id}`}>
              {s.name}
            </option>
          ))}
          {target.value === "section" && sectionId && !sections.some((s) => s.id === sectionId) && (
            <option value={`section:${sectionId}`}>Раздел {sectionId}</option>
          )}
        </optgroup>
        <optgroup label="Другое">
          <option value="url">Свой адрес (другой сайт, соцсеть, телефон…)</option>
        </optgroup>
      </select>
      <FieldDescription description="Куда прокрутить или перейти при нажатии." path={path} />
      {(target.showError || section.showError) && <FieldError path={path} showError />}
    </div>
  );
};

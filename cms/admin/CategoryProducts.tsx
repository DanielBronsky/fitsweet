"use client";

import { useEffect, useState } from "react";
import { Link, useField } from "@payloadcms/ui";
import type { UIFieldClientComponent } from "payload";

type Item = { id: number; title?: string; price?: number; active?: boolean };

export const CategoryProducts: UIFieldClientComponent = ({ path }) => {
  const categoryPath = path.replace(/[^.]+$/, "category");
  const { value } = useField<number | { id: number } | null>({ path: categoryPath });
  const categoryId = value && typeof value === "object" ? value.id : value;
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    let alive = true;
    fetch(`/api/products?depth=0&limit=100&sort=_order&where[category][equals]=${categoryId}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((d: { docs: Item[] }) => alive && setItems(d.docs))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [categoryId]);

  if (!categoryId) {
    return <p style={{ color: "var(--theme-elevation-500)", margin: "0 0 20px" }}>Выберите категорию — здесь появятся её товары.</p>;
  }

  const list = items ?? [];
  return (
    <div
      style={{
        margin: "4px 0 24px",
        padding: 16,
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: 8,
        background: "var(--theme-elevation-50)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <strong style={{ fontWeight: 600 }}>
          Товары в этом разделе: {items === null ? "…" : list.length}
        </strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href={`/admin/collections/products/create?category=${categoryId}`}
            className="btn btn--style-primary btn--size-small"
            style={{ margin: 0 }}
          >
            + Добавить товар в этот раздел
          </Link>
          <Link
            href={`/admin/collections/products?where[category][equals]=${categoryId}`}
            className="btn btn--style-secondary btn--size-small"
            style={{ margin: 0 }}
          >
            Все товары раздела
          </Link>
        </div>
      </div>
      {list.length > 0 && (
        <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 6 }}>
          {list.map((p) => (
            <li key={p.id} style={{ display: "flex", gap: 10, alignItems: "baseline", opacity: p.active === false ? 0.5 : 1 }}>
              <Link href={`/admin/collections/products/${p.id}`} style={{ textDecoration: "underline" }}>
                {p.title || `Товар ${p.id}`}
              </Link>
              <span style={{ color: "var(--theme-elevation-500)", fontSize: 13 }}>
                {p.price ?? 0} MDL{p.active === false ? " · скрыт" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
      {items !== null && list.length === 0 && (
        <p style={{ margin: "12px 0 0", color: "var(--theme-elevation-500)" }}>
          Пока пусто — раздел на сайте не показывается, пока в нём нет ни одного товара.
        </p>
      )}
    </div>
  );
};

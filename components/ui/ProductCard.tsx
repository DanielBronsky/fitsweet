"use client";

import { useState, type CSSProperties } from "react";
import type { Product } from "@/lib/types";
import type { CatalogData } from "@/lib/catalog";
import { kbjuNumbers, productName, tileName } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, style }: { product: Product; style: CatalogData["cards"] }) {
  const { locale, dict } = useI18n();
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const vars = { "--btn": style.buttonColor, "--btn-active": style.buttonActive } as CSSProperties;

  return (
    <article
      style={{ background: style.background, ...vars }}
      className="group flex h-full flex-col overflow-hidden rounded-card transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <ProductImage
          product={product}
          alt={productName(product, locale)}
          sizes="(max-width: 640px) 58vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 150px"
          className={`transition-transform duration-500 group-hover:scale-[1.04] ${style.blendPhoto ? "mix-blend-multiply" : ""}`}
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-2.5 pb-3.5 pt-2.5 text-center">
        <h3
          style={{ color: style.nameColor, fontFamily: style.nameFont, fontWeight: style.nameWeight }}
          className="flex min-h-[28px] items-center justify-center heading-caps text-[11px] leading-[1.25]"
          title={productName(product, locale)}
        >
          {tileName(product, locale)}
        </h3>

        <p style={{ color: style.infoColor }} className="mt-1.5 min-h-[26px] text-[9.5px] leading-[1.4]">
          {product.kbju.kcal > 0 && kbjuNumbers(product)}
          {product.weight > 0 && (
            <span className="block">
              {product.weightLabel
                ? product.weightLabel[locale].replace("{w}", String(product.weight))
                : dict.catalog.perBar(product.weight)}
            </span>
          )}
        </p>

        <p style={{ color: style.priceColor }} className="pt-2 text-[15px] font-bold leading-none">
          {dict.common.price(product.price)}
        </p>

        <button
          type="button"
          onClick={onAdd}
          className={`mt-2.5 h-[26px] rounded-full border px-3.5 text-[9.5px] font-medium transition-colors duration-200
            ${
              added
                ? "border-[var(--btn-active)] bg-[var(--btn-active)] text-cream"
                : "border-[color-mix(in_srgb,var(--btn)_70%,white)] bg-transparent text-[var(--btn)] hover:border-[var(--btn)] hover:bg-[var(--btn)] hover:text-cream"
            }`}
        >
          {added ? style.addedText : style.addText}
        </button>
      </div>
    </article>
  );
}

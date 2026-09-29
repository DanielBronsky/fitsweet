"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { kbjuNumbers, productName, tileName } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/context";

export function ProductCard({ product }: { product: Product }) {
  const { locale, dict } = useI18n();
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={product.image}
          alt={productName(product, locale)}
          fill
          sizes="(max-width: 640px) 62vw, (max-width: 1024px) 30vw, 150px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-2.5 pb-3.5 pt-2.5 text-center">
        <h3
          className="flex min-h-[28px] items-center justify-center heading-caps text-[11px] leading-[1.25] text-green-900"
          title={productName(product, locale)}
        >
          {tileName(product, locale)}
        </h3>

        {/* На макете КБЖУ в две строки */}
        <p className="mt-1.5 min-h-[26px] text-[9.5px] leading-[1.4] text-muted">
          {kbjuNumbers(product)}
          <span className="block">{dict.catalog.perBar(product.weight)}</span>
        </p>

        <p className="pt-2 text-[15px] font-bold leading-none text-green-900">
          {dict.common.price(product.price)}
        </p>

        <button
          type="button"
          onClick={onAdd}
          className={`mt-2.5 h-[26px] rounded-full border px-3.5 text-[9.5px] font-medium transition-colors duration-200
            ${
              added
                ? "border-green-700 bg-green-700 text-cream"
                : "border-green-500 bg-transparent text-green-700 hover:bg-green-700 hover:text-cream"
            }`}
        >
          {added ? dict.catalog.added : dict.catalog.addToCart}
        </button>
      </div>
    </article>
  );
}

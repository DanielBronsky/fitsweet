"use client";

import { useState } from "react";
import { useProducts } from "@/lib/products-context";
import type { CatalogData } from "@/lib/catalog";
import type { CustomSectionData } from "@/lib/custom-sections";
import { ProductCard } from "@/components/ui/ProductCard";

type Data = Extract<CustomSectionData, { template: "products" }>;

export function CustomProducts({ data, cardStyle }: { data: Data; cardStyle: CatalogData["cards"] }) {
  const { products } = useProducts();
  const [expanded, setExpanded] = useState(false);
  const items = products.filter((p) => p.category === data.category);
  if (items.length === 0) return null;
  const collapsed = !expanded && items.length > data.initialCount;

  return (
    <>
      <div className="scroll-snap-x -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 lg:mt-9 lg:gap-2.5">
        {items.map((p, i) => (
          <div
            key={p.id}
            className={`snap-item w-[58%] shrink-0 sm:w-[calc((100%-1.5rem)/3)] md:w-[calc((100%-2.25rem)/4)] lg:w-[calc((100%-7*0.625rem)/8)] ${
              collapsed && i >= data.initialCount ? "hidden" : ""
            }`}
          >
            <ProductCard product={p} style={cardStyle} />
          </div>
        ))}
      </div>
      {collapsed && (
        <div className="mt-9 flex justify-center lg:mt-11">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-green-200 bg-white px-9 text-[13px] font-medium text-green-900 transition-[filter] duration-200 hover:brightness-95"
          >
            {data.moreText}
          </button>
        </div>
      )}
    </>
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "./types";
import type { Mood } from "./moods";
import type { ShippingRules } from "./delivery-data";

type ProductsContextValue = {
  products: Product[];
  moods: Mood[];
  shipping: ShippingRules;
  byId: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextValue>({
  products: [],
  moods: [],
  shipping: { price: 40, freeFrom: 300 },
  byId: () => undefined,
});

export function ProductsProvider({
  products,
  moods,
  shipping,
  children,
}: {
  products: Product[];
  moods: Mood[];
  shipping: ShippingRules;
  children: ReactNode;
}) {
  const map = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const byId = useCallback((id: string) => map.get(id), [map]);
  const value = useMemo(() => ({ products, moods, shipping, byId }), [products, moods, shipping, byId]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => useContext(ProductsContext);

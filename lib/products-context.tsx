"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "./types";
import type { Mood } from "./moods";

type ProductsContextValue = { products: Product[]; moods: Mood[]; byId: (id: string) => Product | undefined };

const ProductsContext = createContext<ProductsContextValue>({ products: [], moods: [], byId: () => undefined });

export function ProductsProvider({ products, moods, children }: { products: Product[]; moods: Mood[]; children: ReactNode }) {
  const map = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const byId = useCallback((id: string) => map.get(id), [map]);
  const value = useMemo(() => ({ products, moods, byId }), [products, moods, byId]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => useContext(ProductsContext);

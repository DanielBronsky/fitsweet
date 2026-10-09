import { ReactNode } from "react";
import type { SectionTitleData } from "@/lib/catalog";
import { Leaf } from "./Icons";

export function SectionTitle({
  children,
  data,
  align = "center",
  as: Tag = "h2",
  className = "",
}: {
  children?: ReactNode;
  data?: SectionTitleData;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const leaf = !data || data.leaf;
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Tag
        style={data ? { color: data.color, fontFamily: data.font, fontWeight: data.weight } : undefined}
        className={`heading-caps text-balance text-[22px] sm:text-[26px] lg:text-[30px] ${data ? "" : "text-green-900"}`}
      >
        {data ? data.text : children}
        {leaf && (
          <Leaf
            className={`ml-3 inline-block w-4 -translate-y-[0.42em] align-middle sm:w-[18px] lg:w-5 ${data ? "" : "text-green-500"}`}
            style={data ? { color: data.leafColor } : undefined}
          />
        )}
      </Tag>
    </div>
  );
}

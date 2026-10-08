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
  return (
    <div
      className={`flex items-start gap-3 ${
        align === "center" ? "justify-center text-center" : "justify-start text-left"
      } ${className}`}
    >
      <Tag
        style={data ? { color: data.color, fontFamily: data.font, fontWeight: data.weight } : undefined}
        className={`heading-caps text-[22px] sm:text-[26px] lg:text-[30px] ${data ? "" : "text-green-900"}`}
      >
        {data ? data.text : children}
      </Tag>
      {(!data || data.leaf) && (
        <Leaf
          className={`mt-0.5 w-4 shrink-0 sm:w-[18px] lg:mt-1 lg:w-5 ${data ? "" : "text-green-500"}`}
          style={data ? { color: data.leafColor } : undefined}
        />
      )}
    </div>
  );
}

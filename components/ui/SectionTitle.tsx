import { ReactNode } from "react";
import { Leaf } from "./Icons";

export function SectionTitle({
  children,
  align = "center",
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
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
      <Tag className="heading-caps text-[22px] text-green-900 sm:text-[26px] lg:text-[30px]">
        {children}
      </Tag>
      <Leaf className="mt-0.5 w-4 shrink-0 text-green-500 sm:w-[18px] lg:mt-1 lg:w-5" />
    </div>
  );
}

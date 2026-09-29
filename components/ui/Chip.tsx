"use client";

import { ReactNode } from "react";

export function Chip({
  active = false,
  children,
  className = "",
  ...rest
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-5
        text-[13px] font-medium transition-colors duration-200
        ${
          active
            ? "border-green-700 bg-green-700 text-cream"
            : "border-green-200 bg-transparent text-green-900 hover:border-green-500"
        } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

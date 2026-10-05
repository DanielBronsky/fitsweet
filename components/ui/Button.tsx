import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-green-700 text-cream hover:bg-green-900 border border-transparent",
  outline:
    "bg-white text-green-900 border border-green-200 hover:border-green-700 hover:bg-cream",
  ghost: "bg-transparent text-green-900 border border-transparent hover:bg-green-700/8",
  light: "bg-cream text-green-900 border border-transparent hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[12.5px]",
  md: "h-10 px-6 text-[13px]",
  lg: "h-12 px-7 text-[14px]",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium
        transition-colors duration-200 disabled:opacity-45 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

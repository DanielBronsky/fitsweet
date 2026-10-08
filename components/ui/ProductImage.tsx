import type { Product } from "@/lib/types";

export function ProductImage({
  product,
  sizes,
  alt = "",
  className = "",
}: {
  product: Product;
  sizes: string;
  alt?: string;
  className?: string;
}) {
  const t = product.thumb;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={t?.src ?? product.image}
      srcSet={t?.srcSet}
      sizes={t ? sizes : undefined}
      width={t?.width ?? 480}
      height={t?.height ?? 480}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

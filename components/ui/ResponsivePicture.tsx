import type { ResponsiveVariant } from "@/cms/media/frames";

export type PictureData = {
  desktop: ResponsiveVariant | null;
  mobile: ResponsiveVariant | null;
  alt: string;
};

const srcSet = (v: ResponsiveVariant) => v.srcset.map((s) => `${s.src} ${s.w}w`).join(", ");

export function ResponsivePicture({
  data,
  breakpoint = 1024,
  sizesDesktop,
  sizesMobile = "100vw",
  priority = false,
  className = "",
}: {
  data: PictureData;
  breakpoint?: number;
  sizesDesktop: string;
  sizesMobile?: string;
  priority?: boolean;
  className?: string;
}) {
  const main = data.desktop ?? data.mobile;
  if (!main) return null;
  const fallback = main.srcset[Math.min(1, main.srcset.length - 1)];

  return (
    <picture>
      {data.mobile && data.desktop && (
        <source media={`(max-width: ${breakpoint - 1}px)`} srcSet={srcSet(data.mobile)} sizes={sizesMobile} type="image/webp" />
      )}
      <img
        src={fallback.src}
        srcSet={srcSet(main)}
        sizes={data.desktop ? sizesDesktop : sizesMobile}
        width={main.width}
        height={main.height}
        alt={data.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={className}
      />
    </picture>
  );
}

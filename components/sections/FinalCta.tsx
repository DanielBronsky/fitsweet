import type { CSSProperties } from "react";
import type { FinalCtaData } from "@/lib/final-cta";
import { Container } from "@/components/ui/Container";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";
import { Leaf } from "@/components/ui/Icons";

const external = (newTab: boolean) => (newTab ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function FinalCta({ data }: { data: FinalCtaData | null }) {
  if (!data) return null;
  const { media, primary, secondary } = data;

  return (
    <section style={{ background: data.background, "--cta-bg": data.background } as CSSProperties} className="relative overflow-hidden">
      {media && (
        <div aria-hidden className="absolute inset-0" style={{ opacity: media.opacity / 100 }}>
          {media.picture ? (
            <ResponsivePicture
              data={media.picture}
              sizesDesktop="100vw"
              className="h-full w-full object-cover object-right"
            />
          ) : (
            media.staticSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.staticSrc} alt="" loading="lazy" className="h-full w-full object-cover object-right" />
            )
          )}
        </div>
      )}
      {media?.fade && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--cta-bg)_15%,color-mix(in_srgb,var(--cta-bg)_75%,transparent))] lg:bg-[linear-gradient(to_right,var(--cta-bg),color-mix(in_srgb,var(--cta-bg)_90%,transparent)_45%,color-mix(in_srgb,var(--cta-bg)_20%,transparent))]"
        />
      )}

      <Container className="relative">
        <div className="flex flex-col items-start gap-6 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div>
            <h2
              style={{ color: data.color, fontFamily: data.font, fontWeight: data.weight }}
              className="heading-caps max-w-[560px] text-[22px] leading-[1.25] sm:text-[26px] lg:text-[30px]"
            >
              {data.lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
            {data.subtitle && (
              <p
                style={{ color: data.subtitle.color, fontFamily: data.subtitle.font, fontWeight: data.subtitle.weight }}
                className="mt-3 text-[13px] opacity-90"
              >
                {data.subtitle.text}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={primary.href}
              {...external(primary.newTab)}
              style={{ background: primary.background, color: primary.color, fontFamily: primary.font, fontWeight: primary.weight }}
              className="inline-flex h-12 items-center justify-center rounded-full px-9 text-[14px] font-medium transition-[filter] duration-200 hover:brightness-95"
            >
              {primary.text}
            </a>
            {secondary && (
              <a
                href={secondary.href}
                {...external(secondary.newTab)}
                style={{ color: secondary.color, borderColor: secondary.color, fontFamily: secondary.font, fontWeight: secondary.weight }}
                className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-[14px] font-medium transition-opacity duration-200 hover:opacity-80"
              >
                {secondary.text}
              </a>
            )}
            {data.leaf && <Leaf className="ml-2 hidden w-9 lg:block" style={{ color: data.leaf, opacity: 0.7 }} />}
          </div>
        </div>
      </Container>
    </section>
  );
}

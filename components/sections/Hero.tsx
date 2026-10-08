import type { CSSProperties } from "react";
import type { HeroData } from "@/lib/hero";
import { Container } from "@/components/ui/Container";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";
import { Stamp } from "@/components/ui/Stamp";
import { HeroHeading } from "./HeroHeading";

export function Hero({ data }: { data: HeroData | null }) {
  if (!data) return null;
  const { heading, subtitle, buttons, media, features } = data;

  return (
    <section style={{ background: data.background }} className="pb-4 pt-8 lg:pb-10 lg:pt-14">
      <Container>
        <div
          className={`grid items-center gap-10 lg:gap-10 xl:gap-12 ${
            media ? "lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]" : ""
          }`}
        >
          <div className="min-w-0 animate-fade-up">
            {heading.lines.length > 0 && <HeroHeading heading={heading} />}

            {subtitle && (
              <p
                style={{ color: subtitle.color, fontFamily: subtitle.font, fontWeight: subtitle.weight }}
                className="mt-6 max-w-[440px] text-[15px] leading-relaxed sm:text-base"
              >
                {subtitle.text}
              </p>
            )}

            {buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {buttons.map((b, i) => (
                  <a
                    key={i}
                    href={b.href}
                    {...(b.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    style={
                      {
                        background: b.background,
                        color: b.color,
                        borderColor: b.border ?? "transparent",
                        fontFamily: b.font,
                        fontWeight: b.weight ?? 500,
                      } as CSSProperties
                    }
                    className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-[14px] transition-[filter] duration-200 hover:brightness-95"
                  >
                    {b.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          {media && (
            <div className="relative">
              <div
                style={{ background: media.background }}
                className="relative aspect-square w-full overflow-hidden rounded-card lg:aspect-[6/5]"
              >
                {media.picture ? (
                  <ResponsivePicture
                    data={media.picture}
                    priority
                    sizesDesktop="(max-width: 1279px) 46vw, 600px"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  media.staticSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.staticSrc} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
                  )
                )}
              </div>
              {media.stamp && (
                <Stamp
                  text={media.stamp.text}
                  style={{ color: media.stamp.color }}
                  className="absolute right-4 top-4 w-[74px] opacity-85 sm:right-6 sm:top-5 sm:w-[88px] lg:w-[100px]"
                />
              )}
            </div>
          )}
        </div>

        {features && features.items.length > 0 && (
          <ul
            style={{ gridTemplateColumns: `repeat(${features.items.length}, minmax(0, 1fr))` }}
            className={`mt-9 grid gap-x-4 lg:mt-10 ${features.items.length > 4 ? "max-w-[640px]" : "max-w-[460px]"}`}
          >
            {features.items.map((f, i) => (
              <li key={i} className="flex flex-col items-center gap-2 text-center">
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image.src} srcSet={f.image.srcSet} width={f.image.width} height={f.image.height} alt="" className="h-8 w-auto" />
                ) : (
                  <SiteIcon name={f.icon} className="h-8 w-8" style={{ color: features.iconColor }} />
                )}
                <span
                  style={{ color: features.color, fontFamily: features.font, fontWeight: features.weight }}
                  className="text-[11px] leading-tight opacity-80"
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

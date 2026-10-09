import type { CSSProperties } from "react";
import type { DeliveryData } from "@/lib/delivery-data";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";

const keepTogether = (text: string) => text.replace(/ (?=\d|MDL|lei|грн|₽|\$|€)/g, "\u00a0");

export function Delivery({ data }: { data: DeliveryData | null }) {
  if (!data) return null;
  const { media, steps, terms, button } = data;
  const right = media?.side === "right";
  const solo = !media;
  const center = solo
    ? {
        title: "sm:text-center",
        text: "sm:mx-auto sm:text-center",
        block: "sm:mx-auto sm:max-w-[900px]",
        step: "",
        button: "sm:mx-auto sm:flex sm:w-fit",
      }
    : {
        title: "sm:text-center lg:text-left",
        text: "sm:mx-auto sm:text-center lg:mx-0 lg:text-left",
        block: "",
        step: "lg:items-start lg:text-left lg:after:left-10 lg:after:right-[-8px]",
        button: "sm:mx-auto sm:flex sm:w-fit lg:mx-0 lg:inline-flex",
      };

  return (
    <section id="delivery" style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        <div
          className={`grid items-center gap-9 lg:items-stretch lg:gap-12 ${
            media ? (right ? "lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]" : "lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]") : ""
          }`}
        >
          {media && (
            <div
              style={{ background: media.background }}
              className={`relative aspect-[13/10] w-full overflow-hidden rounded-card lg:aspect-auto lg:h-full lg:min-h-[440px] ${right ? "lg:order-2" : ""}`}
            >
              {media.picture ? (
                <ResponsivePicture
                  data={media.picture}
                  sizesDesktop="(max-width: 1024px) 100vw, 560px"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                media.staticSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.staticSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                )
              )}
            </div>
          )}

          <div className="lg:flex lg:flex-col lg:justify-center">
            <SectionTitle align="left" className={center.title} data={data.title} />

            {data.subtitle && (
              <p style={{ color: data.subtitle.color }} className={`mt-5 max-w-[520px] text-pretty text-[15px] leading-relaxed ${center.text}`}>
                {data.subtitle.text}
              </p>
            )}

            {steps && (
              <ol
                style={{ "--step-color": steps.numberColor } as CSSProperties}
                className={`mt-9 grid gap-x-4 gap-y-3.5 sm:grid-cols-4 sm:gap-y-6 sm:mt-11 ${center.block}`}
              >
                {steps.items.map((text, i) => (
                  <li
                    key={i}
                    style={{ fontFamily: steps.font }}
                    className={`relative flex items-center gap-3 sm:flex-col sm:after:absolute sm:after:top-4 sm:after:h-px sm:after:bg-[color-mix(in_srgb,var(--step-color)_45%,transparent)] sm:last:after:hidden sm:items-center sm:text-center sm:after:left-[calc(50%+24px)] sm:after:right-[calc(8px-50%)] ${center.step}`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--step-color)] text-[12px] font-semibold text-[var(--step-color)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: steps.color }} className="text-balance text-[13px] leading-snug">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {terms && (
              <dl className={`mt-9 grid grid-cols-2 gap-3 ${solo ? "sm:mx-auto sm:max-w-[900px] lg:grid-cols-4" : ""}`}>
                {terms.items.map((t, i) => (
                  <div
                    key={i}
                    style={{ background: terms.background, fontFamily: terms.font }}
                    className="flex flex-col gap-1.5 rounded-tile px-4 py-3.5 sm:px-5 sm:py-4"
                  >
                    <dt style={{ color: terms.titleColor }} className="text-[11.5px] leading-tight">
                      {t.title}
                    </dt>
                    <dd style={{ color: terms.valueColor, fontWeight: terms.weight ?? 600 }} className="text-balance text-[14px] leading-snug">
                      {keepTogether(t.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {button && (
              <a
                href={button.href}
                {...(button.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                style={{ background: button.background, color: button.color, fontFamily: button.font }}
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-full px-7 text-[14px] font-medium transition-[filter] duration-200 hover:brightness-95 sm:mt-10 ${center.button}`}
              >
                {button.text}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

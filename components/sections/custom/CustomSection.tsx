import type { CustomSectionData } from "@/lib/custom-sections";
import type { CatalogData } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { CustomProducts } from "./CustomProducts";

const gridCols: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export function CustomSection({ data, cardStyle }: { data: CustomSectionData; cardStyle: CatalogData["cards"] }) {
  const center = data.align === "center";
  const head = (
    <>
      <SectionTitle data={data.title} align={data.align} />
      {data.subtitle && (
        <p
          style={{ color: data.subtitle.color }}
          className={`mt-4 max-w-[640px] text-pretty text-[15px] leading-relaxed ${center ? "mx-auto text-center" : ""}`}
        >
          {data.subtitle.text}
        </p>
      )}
    </>
  );

  return (
    <section id={data.anchor} style={{ background: data.background }} className="py-14 sm:py-16 lg:py-20">
      <Container>
        {data.template !== "textImage" && head}

        {data.template === "products" && <CustomProducts data={data} cardStyle={cardStyle} />}

        {data.template === "textImage" && (
          <div className={`grid items-center gap-9 lg:gap-12 ${data.picture ? "lg:grid-cols-2" : ""}`}>
            {data.picture && (
              <div
                style={{ background: data.pictureBackground }}
                className={`relative aspect-[13/10] w-full overflow-hidden rounded-card ${data.side === "right" ? "lg:order-2" : ""}`}
              >
                <ResponsivePicture
                  data={data.picture}
                  sizesDesktop="(max-width: 1024px) 100vw, 600px"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <SectionTitle data={data.title} align="left" />
              {data.subtitle && (
                <p style={{ color: data.subtitle.color }} className="mt-4 text-pretty text-[15px] leading-relaxed">
                  {data.subtitle.text}
                </p>
              )}
              <div className="mt-5 grid gap-4">
                {data.paragraphs.map((p, i) => (
                  <p key={i} style={{ color: data.textColor }} className="whitespace-pre-line text-pretty text-[15px] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {data.button && (
                <a
                  href={data.button.href}
                  {...(data.button.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{ background: data.button.background, color: data.button.color }}
                  className="mt-7 inline-flex h-12 items-center justify-center rounded-full px-7 text-[14px] font-medium transition-[filter] duration-200 hover:brightness-95"
                >
                  {data.button.text}
                </a>
              )}
            </div>
          </div>
        )}

        {data.template === "features" && (
          <ul className={`mt-9 grid gap-4 sm:grid-cols-2 lg:mt-11 ${gridCols[data.columns] ?? "lg:grid-cols-3"}`}>
            {data.items.map((f, i) => (
              <li key={i} style={{ background: data.cardBackground }} className="rounded-card p-6">
                <SiteIcon name={f.icon} className="h-8 w-8" style={{ color: data.iconColor }} />
                <h3
                  style={{ color: data.titleColor, fontFamily: data.titleFont, fontWeight: data.titleWeight ?? 600 }}
                  className="mt-4 text-[16px] leading-snug"
                >
                  {f.title}
                </h3>
                {f.text && (
                  <p style={{ color: data.textColor }} className="mt-2 text-pretty text-[14px] leading-relaxed">
                    {f.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {data.template === "gallery" && (
          <ul className={`mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-11 ${gridCols[data.columns] ?? "lg:grid-cols-4"}`}>
            {data.items.map((g, i) => (
              <li key={i}>
                <figure>
                  <div className="relative aspect-square overflow-hidden rounded-tile">
                    <ResponsivePicture
                      data={g.picture}
                      sizesDesktop={`(max-width: 640px) 50vw, (max-width: 1024px) 33vw, ${Math.round(1200 / data.columns)}px`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  {g.caption && <figcaption className="mt-2 text-[12.5px] text-muted">{g.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        )}

        {data.template === "faq" && (
          <div className={`mt-9 grid gap-3 lg:mt-11 ${center ? "mx-auto max-w-[820px]" : "max-w-[820px]"}`}>
            {data.items.map((q, i) => (
              <details key={i} style={{ background: data.cardBackground }} className="group rounded-tile px-5 py-4 open:pb-5">
                <summary
                  style={{ color: data.questionColor }}
                  className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden"
                >
                  {q.question}
                  <span aria-hidden className="text-[20px] leading-none transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p style={{ color: data.answerColor }} className="mt-3 whitespace-pre-line text-pretty text-[14px] leading-relaxed">
                  {q.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

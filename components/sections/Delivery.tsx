"use client";

import Image from "next/image";
import { stepNumbers } from "@/lib/delivery";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";

export function Delivery() {
  const { dict } = useI18n();

  return (
    <section id="delivery" className="bg-beige py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10">
          <div className="relative aspect-[13/10] w-full overflow-hidden rounded-card bg-cream">
            <Image
              src="/images/delivery/box.svg"
              alt={dict.delivery.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>

          <div>
            <SectionTitle align="left">{dict.delivery.title}</SectionTitle>

            <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-muted">
              {dict.delivery.subtitle}
            </p>

            <ol className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-3">
              {dict.delivery.steps.map((text, i) => (
                <li key={stepNumbers[i]} className="flex items-start gap-2">
                  <span className="text-[13px] font-semibold leading-none text-green-500">
                    {stepNumbers[i]}
                  </span>
                  <span className="text-[11.5px] leading-snug text-green-900">{text}</span>
                </li>
              ))}
            </ol>

            <dl className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {dict.delivery.terms.map((t) => (
                <div key={t.title} className="rounded-tile bg-white px-3.5 py-3">
                  <dt className="text-[10.5px] leading-tight text-muted">{t.title}</dt>
                  <dd className="mt-1 text-[11.5px] font-semibold leading-tight text-green-900">
                    {t.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Button as="a" href="#order" size="lg" className="mt-8">
              {dict.delivery.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { featureKeys } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FeatureIcon } from "@/components/ui/Icons";
import { Stamp } from "@/components/ui/Stamp";

export function Hero() {
  const { dict } = useI18n();

  return (
    <section className="bg-cream pb-4 pt-8 lg:pb-10 lg:pt-14">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-10 xl:gap-12">
          <div className="animate-fade-up">
            <h1 className="heading-caps text-[32px] leading-[1.1] sm:text-[42px] lg:text-[46px] xl:text-[50px]">
              <span className="block text-green-900">{dict.hero.line1}</span>
              <span className="block text-green-500 sm:whitespace-nowrap">{dict.hero.line2}</span>
              <span className="block text-green-500 sm:whitespace-nowrap">{dict.hero.line3}</span>
            </h1>

            <p className="mt-6 max-w-[440px] text-[15px] leading-relaxed text-muted sm:text-base">
              {dict.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="#catalog" size="lg">
                {dict.hero.ctaPrimary}
              </Button>
              <Button as="a" href="#order" variant="outline" size="lg">
                {dict.hero.ctaSecondary}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[6/5] w-full overflow-hidden rounded-card bg-sage">
              <Image
                src="/images/hero/bars.svg"
                alt={dict.hero.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            </div>
            <Stamp className="absolute right-4 top-4 w-[74px] text-green-700/85 sm:right-6 sm:top-5 sm:w-[88px] lg:w-[100px]" />
          </div>
        </div>

        {/* Преимущества: на макете — тонкие иконки без обводки, прижаты влево под кнопками */}
        <ul className="mt-9 grid max-w-[460px] grid-cols-4 gap-x-4 lg:mt-10">
          {featureKeys.map((key) => (
            <li key={key} className="flex flex-col items-center gap-2 text-center">
              <FeatureIcon name={key} className="w-[32px] text-green-700" />
              <span className="text-[11px] leading-tight text-green-900/80">
                {dict.hero.features[key]}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

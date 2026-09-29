"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Leaf } from "@/components/ui/Icons";

export function FinalCta() {
  const { dict } = useI18n();

  return (
    <section className="relative overflow-hidden bg-olive">
      <Image
        src="/images/hero/bars.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-right opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-olive via-olive/90 to-olive/20" />

      <Container className="relative">
        <div className="flex flex-col items-start gap-6 py-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div>
            <h2 className="heading-caps max-w-[560px] text-[22px] leading-[1.25] text-cream sm:text-[26px] lg:text-[30px]">
              {dict.finalCta.line1}
              <br />
              {dict.finalCta.line2}
            </h2>
            <p className="mt-3 text-[13px] text-cream/90">
              {dict.finalCta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Button as="a" href="#catalog" variant="light" size="lg" className="px-9">
              {dict.finalCta.cta}
            </Button>
            <Leaf className="hidden w-9 text-green-200/70 lg:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}

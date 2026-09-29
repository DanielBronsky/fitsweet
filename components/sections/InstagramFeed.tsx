"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/Icons";

/** TODO(данные): плитки — заглушки. Подключить реальную ленту или залить фото вручную. */
const tiles = ["1", "2", "3", "4", "5"];

export function InstagramFeed() {
  const { dict } = useI18n();

  return (
    <section id="instagram" className="bg-cream py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionTitle align="left">{dict.instagram.title}</SectionTitle>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12">
          <div className="scroll-snap-x -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
            {tiles.map((t) => (
              <a
                key={t}
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-item group relative aspect-square w-[46%] shrink-0 overflow-hidden rounded-tile bg-card sm:w-auto"
              >
                <Image
                  src={`/images/instagram/${t}.svg`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 46vw, 180px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-green-900/0 text-cream opacity-0 transition-all duration-300 group-hover:bg-green-900/30 group-hover:opacity-100">
                  <InstagramIcon className="w-7" />
                </span>
              </a>
            ))}
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-green-900">{dict.instagram.followUs}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              {dict.instagram.description}
            </p>
            <p className="mt-4 flex w-fit items-center gap-2 text-[14px] text-green-900">
              <InstagramIcon className="w-[18px] text-green-700" />@{siteConfig.instagram}
            </p>
            <Button
              as="a"
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="mt-6 w-full sm:w-auto"
            >
              <InstagramIcon className="w-[18px]" />
              {dict.instagram.cta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

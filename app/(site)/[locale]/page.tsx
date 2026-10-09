import { Fragment, type ReactNode } from "react";
import { getLayout } from "@/lib/layout";
import { getCustomSection, type CustomSectionData } from "@/lib/custom-sections";
import { CustomSection } from "@/components/sections/custom/CustomSection";
import { getWhereData } from "@/lib/where";
import { getDeliveryData } from "@/lib/delivery-data";
import { getBoxData } from "@/lib/box";
import { getReviewsData } from "@/lib/reviews";
import { getInstagramData } from "@/lib/instagram-feed";
import type { SectionKey } from "@/cms/sections";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { getHeroData } from "@/lib/hero";
import { Catalog } from "@/components/sections/Catalog";
import { Moods } from "@/components/sections/Moods";
import { WhereToBuy } from "@/components/sections/WhereToBuy";
import { Delivery } from "@/components/sections/Delivery";
import { BoxBuilder } from "@/components/sections/BoxBuilder";
import { Reviews } from "@/components/sections/Reviews";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { OrderForm } from "@/components/sections/OrderForm";
import { FinalCta } from "@/components/sections/FinalCta";
import { getCardStyle, getCatalogData, getMoodsData, getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = getDictionary(locale);
  const products = await getProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    description: dict.meta.description,
    url: `${siteConfig.url}/${l}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city[l],
      addressCountry: "MD",
    },
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: p.name[l],
        description: `${dict.common.ingredients}: ${p.ingredients[l]}`,
      },
      price: p.price,
      priceCurrency: "MDL",
    })),
  };

  const layout = await getLayout();
  const cardStyle = await getCardStyle(l);
  const customs = new Map<number, CustomSectionData | null>();
  for (const e of layout) if (e.kind === "custom") customs.set(e.id, await getCustomSection(e.id, l));
  const faqItems = [...customs.values()].flatMap((c) => (c?.template === "faq" ? c.items : []));
  const sections: Record<SectionKey, ReactNode> = {
    hero: <Hero data={await getHeroData(l)} />,
    catalog: <Catalog data={await getCatalogData(l)} />,
    moods: <Moods data={await getMoodsData(l)} />,
    where: <WhereToBuy data={await getWhereData(l)} />,
    delivery: <Delivery data={await getDeliveryData(l)} />,
    box: <BoxBuilder data={await getBoxData(l)} />,
    reviews: <Reviews data={await getReviewsData(l)} />,
    instagram: <InstagramFeed data={await getInstagramData(l)} />,
    order: <OrderForm />,
    finalCta: <FinalCta />,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            }),
          }}
        />
      )}
      {layout.map((e) => {
        if (e.kind === "builtin") return <Fragment key={e.key}>{sections[e.key]}</Fragment>;
        const data = customs.get(e.id);
        return data ? <CustomSection key={`c${e.id}`} data={data} cardStyle={cardStyle} /> : null;
      })}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, locales, localeTags, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getPalette, getSeo, getTypographyCss, imageAlt, imageFrame, paletteCss } from "@/lib/cms";
import { getHeaderData } from "@/lib/header";
import { getMoods, getProducts } from "@/lib/catalog";
import { ProductsProvider } from "@/lib/products-context";
import type { FixedVariant } from "@/cms/media/frames";
import { I18nProvider } from "@/lib/i18n/context";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import "../globals.css";
import { fontVariables } from "../fonts";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const ogLocale = (l: Locale) => localeTags[l].replace("-", "_");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = await getSeo();

  const title = seo?.title?.[locale] || dict.meta.title;
  const description = seo?.description?.[locale] || dict.meta.description;
  const keywordsText = seo?.keywords?.[locale];
  const keywords = keywordsText
    ? keywordsText.split(",").map((k) => k.trim()).filter(Boolean)
    : dict.meta.keywords;
  const og = imageFrame<FixedVariant>(seo?.ogImage, "og");

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s · ${siteConfig.name}` },
    description,
    keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(ogLocale),
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title,
      description,
      ...(og && {
        images: [{ url: og.src, width: og.width, height: og.height, alt: imageAlt(seo?.ogImage, locale) }],
      }),
    },
    twitter: {
      card: og ? "summary_large_image" : "summary",
      title,
      description,
      ...(og && { images: [og.src] }),
    },
    robots: siteConfig.indexing ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const themeCss = paletteCss(await getPalette()) + (await getTypographyCss());

  return (
    <html lang={localeTags[locale]} className={fontVariables}>
      <body className="antialiased">
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <I18nProvider locale={locale}>
          <ProductsProvider products={await getProducts()} moods={await getMoods()}>
          <a
            href="#catalog"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-green-700 focus:px-5 focus:py-3 focus:text-cream"
          >
            {dict.header.skipToCatalog}
          </a>
          <Header data={await getHeaderData(locale)} />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          </ProductsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

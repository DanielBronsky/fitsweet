import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { getDictionary, locales, localeTags, isLocale, type Locale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/context";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.title, template: `%s · ${siteConfig.name}` },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeTags[l], `/${l}`]),
      ),
    },
    openGraph: {
      type: "website",
      locale: localeTags[locale as Locale] ?? localeTags.ru,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeTags[l]),
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true },
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

  return (
    <html lang={localeTags[locale]} className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <I18nProvider locale={locale}>
          <a
            href="#catalog"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-green-700 focus:px-5 focus:py-3 focus:text-cream"
          >
            {dict.header.skipToCatalog}
          </a>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </I18nProvider>
      </body>
    </html>
  );
}

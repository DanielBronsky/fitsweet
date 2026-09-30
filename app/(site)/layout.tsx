/**
 * Корневой layout обязателен для Next.js, но всю разметку задаёт
 * app/[locale]/layout.tsx — включая <html> с нужным lang.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

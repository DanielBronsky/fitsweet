"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n/context";
import { GlobeIcon } from "@/components/ui/Icons";

export function LocaleSwitch({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: string) => {
    // /ru/... → /ro/...
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  };

  const dark = tone === "dark";

  return (
    <div
      className={`flex items-center gap-1 rounded-full border py-1 pl-2.5 pr-1 ${
        dark ? "border-green-200 bg-white" : "border-cream/40 bg-cream/10"
      } ${className}`}
      role="group"
      aria-label={dict.header.switchLanguage}
    >
      <GlobeIcon className={`w-[15px] ${dark ? "text-green-700" : "text-cream"}`} />

      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => !active && switchTo(l)}
            aria-current={active ? "true" : undefined}
            lang={l}
            title={localeNames[l]}
            className={`h-7 rounded-full px-2.5 text-[12px] font-bold tracking-wide transition-colors
              ${
                active
                  ? dark
                    ? "bg-green-700 text-cream"
                    : "bg-cream text-green-900"
                  : dark
                    ? "text-green-900/70 hover:bg-green-700/10 hover:text-green-900"
                    : "text-cream/75 hover:bg-cream/15 hover:text-cream"
              }`}
          >
            {localeNames[l]}
          </button>
        );
      })}
    </div>
  );
}

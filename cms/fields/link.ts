import { ru } from "../../lib/i18n/ru";
import type { Field } from "payload";

export const sectionAnchors = [
  { value: "catalog", label: ru.catalog.title },
  { value: "about", label: ru.moods.title },
  { value: "where", label: ru.where.title },
  { value: "delivery", label: ru.delivery.title },
  { value: "box", label: ru.box.title },
  { value: "reviews", label: ru.reviews.title },
  { value: "instagram", label: ru.instagram.title },
  { value: "order", label: ru.order.title },
] as const;

export type LinkValue = { target?: string | null; url?: string | null; newTab?: boolean | null };

export function linkFields({ defaultTarget = "catalog" }: { defaultTarget?: string } = {}): Field[] {
  return [
    {
      type: "row",
      fields: [
        {
          name: "target",
          type: "select",
          label: "Куда ведёт",
          admin: { width: "50%", description: "К какому блоку страницы прокрутить при нажатии." },
          defaultValue: defaultTarget,
          required: true,
          options: [
            ...sectionAnchors.map((a) => ({ value: a.value, label: `Блок на странице: «${a.label}»` })),
            { value: "url", label: "Свой адрес (другой сайт, соцсеть, телефон…)" },
          ],
        },
        {
          name: "url",
          type: "text",
          label: "Адрес",
          admin: {
            width: "50%",
            placeholder: "https://instagram.com/fitsweet.md",
            condition: (_, sibling) => sibling?.target === "url",
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: LinkValue }) => {
            if (siblingData?.target !== "url") return true;
            if (!value) return "Укажите адрес";
            return /^(https?:\/\/|\/|#|mailto:|tel:)/.test(value) || "Адрес должен начинаться с https://, /, #, mailto: или tel:";
          },
        },
      ],
    },
    {
      name: "newTab",
      type: "checkbox",
      label: "Открывать в новой вкладке",
      defaultValue: false,
      admin: { condition: (_, sibling) => sibling?.target === "url" },
    },
  ];
}

export type ResolvedLink = { href: string; newTab: boolean };

export function resolveLink(link: LinkValue | null | undefined): ResolvedLink {
  if (link?.target === "url" && link.url) return { href: link.url, newTab: Boolean(link.newTab) };
  return { href: `#${link?.target || "catalog"}`, newTab: false };
}

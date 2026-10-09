import type { GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { pageSections } from "../sections";

export const Layout: GlobalConfig = {
  slug: "layout",
  label: "Порядок блоков",
  admin: {
    group: false,
    description:
      "Перетаскивайте блоки за ⠿, чтобы поменять порядок на странице, и нажмите «Сохранить». Новые разделы появляются здесь сами. Шапка всегда сверху, подвал — снизу. Баннер лучше оставить первым: в нём главный заголовок страницы для Google.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [afterContentChange],
  },
  fields: [
    {
      name: "blocks",
      type: "array",
      label: "Блоки страницы сверху вниз",
      labels: { singular: "блок", plural: "блоки" },
      admin: {
        initCollapsed: true,
        components: { RowLabel: "/cms/admin/SectionRowLabel#SectionRowLabel" },
      },
      validate: (rows: unknown) => {
        const list = (Array.isArray(rows) ? rows : []) as { block?: string; custom?: number | { id: number } | null }[];
        const keys = list.filter((r) => r.block !== "custom").map((r) => r.block);
        const dup = keys.find((k, i) => k && keys.indexOf(k) !== i);
        if (dup) return `Блок «${pageSections.find((s) => s.key === dup)?.label}» добавлен дважды`;
        const missing = pageSections.find((s) => !keys.includes(s.key));
        if (missing) return `Блок «${missing.label}» нельзя удалить — скройте его в самом разделе («Показывать раздел»)`;
        const customs = list.filter((r) => r.block === "custom").map((r) => (typeof r.custom === "object" ? r.custom?.id : r.custom));
        if (customs.some((c) => !c)) return "Выберите свой раздел в каждой строке «Свой раздел»";
        if (customs.some((c, i) => customs.indexOf(c) !== i)) return "Один и тот же свой раздел добавлен дважды";
        return true;
      },
      fields: [
        {
          name: "block",
          type: "select",
          label: "Блок",
          required: true,
          admin: { hidden: true },
          options: [
            ...pageSections.map((s) => ({ value: s.key, label: s.label })),
            { value: "custom", label: "Свой раздел…" },
          ],
        },
        {
          name: "custom",
          type: "relationship",
          relationTo: "customSections",
          label: "Раздел",
          admin: { hidden: true },
        },
      ],
    },
  ],
};

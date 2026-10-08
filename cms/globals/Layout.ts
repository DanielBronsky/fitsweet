import type { GlobalConfig } from "payload";
import { afterContentChange } from "../hooks/revalidateSite";
import { pageSections } from "../sections";

export const Layout: GlobalConfig = {
  slug: "layout",
  label: "Порядок блоков",
  admin: {
    group: false,
    description:
      "Перетаскивайте блоки за ⠿, чтобы поменять их порядок на странице. Шапка всегда сверху, подвал — снизу. Баннер лучше оставить первым: в нём главный заголовок страницы для Google.",
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
      minRows: pageSections.length,
      maxRows: pageSections.length,
      admin: {
        initCollapsed: true,
        components: { RowLabel: "/cms/admin/SectionRowLabel#SectionRowLabel" },
      },
      validate: (rows: unknown) => {
        const list = (Array.isArray(rows) ? rows : []) as { block?: string }[];
        const keys = list.map((r) => r.block);
        const dup = keys.find((k, i) => k && keys.indexOf(k) !== i);
        if (dup) return `Блок «${pageSections.find((s) => s.key === dup)?.label}» добавлен дважды`;
        return true;
      },
      fields: [
        {
          name: "block",
          type: "select",
          label: "Блок",
          required: true,
          options: pageSections.map((s) => ({ value: s.key, label: s.label })),
        },
      ],
    },
  ],
};

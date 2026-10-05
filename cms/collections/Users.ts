import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Администратор", plural: "Администраторы" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
    group: "Настройки",
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
    },
  ],
};

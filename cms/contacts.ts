export const contactTypes = [
  { value: "phone", label: "Телефон" },
  { value: "email", label: "Почта" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "viber", label: "Viber" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "address", label: "Адрес" },
  { value: "hours", label: "Часы работы" },
  { value: "url", label: "Другая ссылка" },
] as const;

export type ContactType = (typeof contactTypes)[number]["value"];

const PHONE_RE = /^\+?[0-9()\-\s]{8,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HANDLE_RE = /^@?[A-Za-z0-9._]{2,40}$/;
const URL_RE = /^https?:\/\/\S+$/;

const handleOf = (value: string) => {
  const v = value.trim();
  if (URL_RE.test(v)) {
    const part = v.replace(/\/+$/, "").split("/").pop() ?? "";
    return part.replace(/^@/, "");
  }
  return v.replace(/^@/, "");
};

export function validateContact(value: string | null | undefined, { siblingData }: { siblingData: { type?: ContactType } }) {
  const v = (value ?? "").trim();
  if (!v) return "Заполните значение";
  switch (siblingData?.type) {
    case "phone":
    case "whatsapp":
    case "viber":
      return PHONE_RE.test(v) || "Телефон в формате +373 69 000 000";
    case "email":
      return EMAIL_RE.test(v) || "Адрес почты, например hello@fitsweet.md";
    case "instagram":
    case "telegram":
    case "tiktok":
      return HANDLE_RE.test(v) || URL_RE.test(v) || "Имя аккаунта (fitsweet.md) или ссылка";
    case "facebook":
      return HANDLE_RE.test(v) || URL_RE.test(v) || "Ссылка на страницу или её имя";
    case "url":
      return URL_RE.test(v) || "Ссылка должна начинаться с https://";
    default:
      return true;
  }
}

const digits = (v: string) => v.replace(/\D/g, "");

export function contactHref(type: ContactType, value: string): string | null {
  const v = value.trim();
  switch (type) {
    case "phone":
      return `tel:+${digits(v)}`;
    case "email":
      return `mailto:${v}`;
    case "instagram":
      return URL_RE.test(v) ? v : `https://www.instagram.com/${handleOf(v)}/`;
    case "telegram":
      return URL_RE.test(v) ? v : `https://t.me/${handleOf(v)}`;
    case "tiktok":
      return URL_RE.test(v) ? v : `https://www.tiktok.com/@${handleOf(v)}`;
    case "facebook":
      return URL_RE.test(v) ? v : `https://www.facebook.com/${handleOf(v)}`;
    case "whatsapp":
      return `https://wa.me/${digits(v)}`;
    case "viber":
      return `viber://chat?number=%2B${digits(v)}`;
    case "address":
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
    case "url":
      return v;
    default:
      return null;
  }
}

export function contactText(type: ContactType, value: string): string {
  const v = value.trim();
  switch (type) {
    case "instagram":
    case "telegram":
    case "tiktok":
      return `@${handleOf(v)}`;
    case "whatsapp":
      return "WhatsApp";
    case "viber":
      return "Viber";
    case "facebook":
      return "Facebook";
    case "url":
      return v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    default:
      return v;
  }
}

export const isSocial = (type: ContactType) => ["instagram", "telegram", "facebook", "tiktok"].includes(type);

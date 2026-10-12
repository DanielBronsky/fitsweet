import type { CSSProperties, ReactNode } from "react";
import type { ContactType } from "@/cms/contacts";

const s = { stroke: "currentColor", strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const art: Record<ContactType, ReactNode> = {
  phone: (
    <path
      {...s}
      d="M21 16.4v2.8a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 2.1 4.2 1.9 1.9 0 0 1 4 2.1h2.8a1.9 1.9 0 0 1 1.9 1.6c.1.9.3 1.7.6 2.5a1.9 1.9 0 0 1-.4 2L7.7 9.4a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.3 1.6.5 2.5.6a1.9 1.9 0 0 1 1.6 2Z"
    />
  ),
  email: (
    <>
      <rect {...s} x="3" y="5" width="18" height="14" rx="2.5" />
      <path {...s} d="m4 7 8 6 8-6" />
    </>
  ),
  instagram: (
    <>
      <rect {...s} x="3" y="3" width="18" height="18" rx="5" />
      <circle {...s} cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </>
  ),
  telegram: (
    <>
      <path {...s} d="M21.5 3.5 2.8 10.6c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.5 4.6 3.4c.6.4 1.4.1 1.6-.6l3-14.7c.2-.9-.6-1.6-1.4-1.3Z" />
      <path {...s} d="m7.4 13.9 10.1-6.4-7.7 7.6" />
    </>
  ),
  whatsapp: (
    <>
      <path {...s} d="M3.5 20.5 4.8 16A8.6 8.6 0 1 1 8 19.2l-4.5 1.3Z" />
      <path {...s} d="M9 8.6c.2-.4.6-.5.9-.4l.8 1.8c.1.3 0 .6-.2.8l-.5.5c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.2-.2.5-.3.8-.2l1.8.8c.2.3 0 .8-.4 1-1.1.7-2.6.5-4.3-.9-1.6-1.3-2.6-3-2.6-4.1 0-.6.2-1.2.4-1.6Z" />
    </>
  ),
  viber: (
    <>
      <path {...s} d="M12 2.8c4.8 0 8.2 1.6 8.6 6.4.3 3.6-.2 6.6-2.6 8-1.6.9-3.6 1.1-5.4 1.1l-3 2.7v-3.1C5.2 17 3.6 14.6 3.4 11c-.3-5.4 2.8-8.2 8.6-8.2Z" />
      <path {...s} d="M9.4 7.6c.2-.3.5-.4.8-.3l.9 1.5c.1.3 0 .5-.2.7l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.4c.2-.2.5-.3.7-.2l1.5.9c.2.3 0 .7-.3.9-1 .6-2.3.4-3.7-.8-1.4-1.1-2.2-2.6-2.2-3.5 0-.6.1-1.1.2-1.5ZM13 6.4a3.8 3.8 0 0 1 3.4 3.4" />
    </>
  ),
  facebook: <path {...s} d="M14 21v-8h3l.5-3.5H14V7.8c0-1 .3-1.8 1.8-1.8H18V3.1A24 24 0 0 0 15.3 3C12.7 3 11 4.6 11 7.5v2H8V13h3v8" />,
  tiktok: <path {...s} d="M14 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14 3c.4 2.7 2.3 4.6 5 4.8" />,
  address: (
    <>
      <path {...s} d="M12 21.5s7-6 7-11.4a7 7 0 1 0-14 0c0 5.4 7 11.4 7 11.4Z" />
      <circle {...s} cx="12" cy="10.2" r="2.5" />
    </>
  ),
  hours: (
    <>
      <circle {...s} cx="12" cy="12" r="8.5" />
      <path {...s} d="M12 7.5V12l3 2" />
    </>
  ),
  url: (
    <>
      <path {...s} d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1" />
      <path {...s} d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1" />
    </>
  ),
};

export function ContactIcon({ type, className = "", style }: { type: ContactType; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style}>
      {art[type]}
    </svg>
  );
}

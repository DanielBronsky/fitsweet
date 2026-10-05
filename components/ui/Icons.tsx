type IconProps = { className?: string };

export function Leaf({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="none">
      <path
        d="M16 29V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 18c0-5 3.6-9.2 9-10-.4 5.6-4 9.4-9 10ZM16 12c0-4.6-3.4-8.4-8.4-9.2C8 8 11.3 11.4 16 12Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function CartIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path
        d="M5.5 8h13l-1.1 11a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6.8a3 3 0 0 1 6 0V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function GlobeIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.4 12h17.2M12 3.4c2.2 2.3 3.4 5.4 3.4 8.6S14.2 18.3 12 20.6c-2.2-2.3-3.4-5.4-3.4-8.6S9.8 5.7 12 3.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function PinIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path
        d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeatureIcon({ name, className = "" }: IconProps & { name: string }) {
  const common = { stroke: "currentColor", strokeWidth: 1.5, fill: "none" } as const;
  const art: Record<string, React.ReactNode> = {
    "no-sugar": (
      <>
        <rect x="6" y="9" width="14" height="10" rx="2" {...common} transform="rotate(-12 13 14)" />
        <path d="M4 21L22 4" {...common} strokeLinecap="round" />
      </>
    ),
    "no-lactose": (
      <>
        <path d="M9 3h6l-.6 3.2 2.1 4.3V20a1 1 0 0 1-1 1H8.5a1 1 0 0 1-1-1v-9.5l2.1-4.3L9 3Z" {...common} strokeLinejoin="round" />
        <path d="M3.5 21.5 21 3.5" {...common} strokeLinecap="round" />
      </>
    ),
    "no-gluten": (
      <>
        <path d="M12 21V9M12 13c0-3 2.4-5.4 5.6-6-.2 3.4-2.6 5.6-5.6 6ZM12 10.5C12 7.7 9.6 5.3 6.4 4.7c.2 3.4 2.6 5.4 5.6 5.8Z" {...common} strokeLinejoin="round" />
        <path d="M3.5 21.5 21 3.5" {...common} strokeLinecap="round" />
      </>
    ),
    tasty: (
      <path d="M12 20.5S4 15.6 4 10.2A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 8 2.2c0 5.4-8 10.3-8 10.3Z" {...common} strokeLinejoin="round" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      {art[name] ?? art.tasty}
    </svg>
  );
}

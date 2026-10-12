type Data = { text: string; hint: string | null; href: string; background: string; color: string };

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="w-[18px] shrink-0">
    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12Z" />
    <path fill="#4285F4" d="M21.2 12.2c0-.6-.1-1.1-.2-1.6H12v3.9h5.4c-.3 1.3-1 2.3-2 3l3.1 2.4c1.8-1.7 2.7-4.2 2.7-7.7Z" />
    <path fill="#FBBC05" d="M6.4 14.3A5.9 5.9 0 0 1 6.1 12c0-.8.1-1.6.4-2.3L3.3 7.2A9.6 9.6 0 0 0 2.4 12c0 1.6.4 3.1 1 4.4l3-2.1Z" />
    <path fill="#34A853" d="M12 21.6c2.6 0 4.8-.9 6.4-2.3l-3.1-2.4c-.8.6-1.9 1-3.3 1-2.6 0-4.7-1.7-5.5-4.1l-3.1 2.4c1.6 3.2 4.9 5.4 8.6 5.4Z" />
  </svg>
);

export function GoogleReviewButton({ data, className = "" }: { data: Data; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
      {data.hint && <p className="max-w-[460px] text-pretty text-[14px] leading-relaxed text-muted">{data.hint}</p>}
      <a
        href={data.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ background: data.background, color: data.color }}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 text-[14px] font-medium transition-[filter] duration-200 hover:brightness-95"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
          <GoogleMark />
        </span>
        {data.text}
        <span aria-hidden>★★★★★</span>
      </a>
    </div>
  );
}

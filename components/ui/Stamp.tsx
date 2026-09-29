/** Круглая «печать» FIT & SWEET · GUILT-FREE из правого верхнего угла hero */
export function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden className={className}>
      <defs>
        <path id="stamp-arc" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" fill="none" />
      </defs>
      <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <text
        fontFamily="Inter, sans-serif"
        fontSize="12.5"
        fontWeight="600"
        letterSpacing="3.4"
        fill="currentColor"
      >
        <textPath href="#stamp-arc" startOffset="0%">
          FIT &amp; SWEET · GUILT-FREE ·&#160;
        </textPath>
      </text>
      <path
        d="M80 96V72M80 80c0-7 5-13 12.5-14-.6 7.8-5.6 13-12.5 14ZM80 76c0-6.4-4.8-11.7-11.8-12.8.5 7.4 5 11.9 11.8 12.8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

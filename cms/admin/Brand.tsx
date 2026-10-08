import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export function AdminLogo() {
  return (
    <div className="fs-brand">
      <span className={`fs-brand__name ${playfair.className}`}>FitSweet</span>
      <span className="fs-brand__sub">Admin</span>
    </div>
  );
}

export function AdminIcon() {
  return (
    <span className={`fs-brand-icon ${playfair.className}`} aria-label="FitSweet Admin">
      FS
    </span>
  );
}

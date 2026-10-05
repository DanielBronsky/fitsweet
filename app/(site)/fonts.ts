import {
  Caveat,
  Comfortaa,
  Cormorant,
  Cormorant_Garamond,
  Inter,
  Jost,
  Lobster,
  Lora,
  Manrope,
  Marck_Script,
  Montserrat,
  Noto_Serif_Display,
  Nunito,
  Onest,
  PT_Serif,
  Playfair,
  Playfair_Display,
  Rubik,
  Unbounded,
  Yeseva_One,
} from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const jost = Jost({ variable: "--font-jost", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const onest = Onest({ variable: "--font-onest", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const comfortaa = Comfortaa({ variable: "--font-comfortaa", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const notoDisplay = Noto_Serif_Display({ variable: "--font-noto-display", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const cormorantLight = Cormorant({ variable: "--font-cormorant-light", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const playfairNew = Playfair({ variable: "--font-playfair-new", subsets: ["latin", "latin-ext", "cyrillic"], axes: ["opsz"], display: "swap", preload: false });
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const ptSerif = PT_Serif({ variable: "--font-pt-serif", subsets: ["latin", "latin-ext", "cyrillic"], weight: ["400", "700"], display: "swap", preload: false });
const yeseva = Yeseva_One({ variable: "--font-yeseva", subsets: ["latin", "latin-ext", "cyrillic"], weight: "400", display: "swap", preload: false });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext", "cyrillic"], display: "swap", preload: false });
const marck = Marck_Script({ variable: "--font-marck", subsets: ["latin", "latin-ext", "cyrillic"], weight: "400", display: "swap", preload: false });
const lobster = Lobster({ variable: "--font-lobster", subsets: ["latin", "latin-ext", "cyrillic"], weight: "400", display: "swap", preload: false });

export const fontVariables = [
  inter,
  playfair,
  manrope,
  montserrat,
  rubik,
  nunito,
  jost,
  onest,
  comfortaa,
  unbounded,
  cormorant,
  notoDisplay,
  cormorantLight,
  playfairNew,
  lora,
  ptSerif,
  yeseva,
  caveat,
  marck,
  lobster,
]
  .map((f) => f.variable)
  .join(" ");

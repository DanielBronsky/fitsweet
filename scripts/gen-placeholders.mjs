import { writeFileSync, mkdirSync } from "node:fs";

const CHOCO_DARK = "#3B2519";
const CHOCO = "#5A3A26";
const CHOCO_LIGHT = "#7A5238";

const bar = (x, y, w, h, rot, fill, topping) => `
  <g transform="translate(${x} ${y}) rotate(${rot})">
    <rect width="${w}" height="${h}" rx="${h * 0.28}" fill="${fill}"/>
    <rect width="${w}" height="${h * 0.42}" rx="${h * 0.2}" fill="#fff" opacity="0.07"/>
    ${topping ?? ""}
  </g>`;

const dots = (n, color, w, h, seed) => {
  let out = "";
  for (let i = 0; i < n; i++) {
    const t = (Math.sin(seed + i * 12.9898) + 1) / 2;
    const u = (Math.sin(seed + i * 78.233) + 1) / 2;
    out += `<circle cx="${18 + t * (w - 36)}" cy="${10 + u * (h - 20)}" r="${
      4 + u * 3
    }" fill="${color}" opacity="0.9"/>`;
  }
  return out;
};

const products = {
  "snickers-peanut": { fill: CHOCO, top: dots(6, "#D9A566", 250, 96, 3) },
  "snickers-almond": { fill: CHOCO_DARK, top: dots(5, "#C79A72", 250, 96, 7) },
  bounty: { fill: CHOCO, top: dots(18, "#F3EDE2", 250, 96, 11) },
  twix: {
    fill: CHOCO_LIGHT,
    top: `<path d="M18 30 q36 -18 72 0 t72 0 t72 0" stroke="${CHOCO_DARK}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  },
  mars: {
    fill: CHOCO,
    top: `<path d="M18 34 q36 -16 72 0 t72 0 t72 0" stroke="${CHOCO_DARK}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  },
  iriska: { fill: CHOCO_DARK, top: dots(8, "#C4405A", 250, 96, 5) + dots(5, "#8FA860", 250, 96, 19) },
  "mango-raspberry": { fill: CHOCO, top: dots(7, "#E8A33D", 250, 96, 23) },
  "almond-cranberry": { fill: CHOCO_DARK, top: dots(6, "#C79A72", 250, 96, 29) + dots(5, "#B03B4E", 250, 96, 31) },
};

const productSvg = (cfg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <rect width="600" height="600" fill="#F7F5F0"/>
  <ellipse cx="300" cy="452" rx="215" ry="30" fill="#2D3526" opacity="0.07"/>
  ${bar(86, 322, 250, 96, -5, cfg.fill, cfg.top)}
  ${bar(268, 224, 250, 96, 10, cfg.fill, cfg.top)}
  <text x="300" y="566" text-anchor="middle" font-family="Inter, sans-serif" font-size="15"
        letter-spacing="2.6" fill="#7C7A70" opacity="0.45">ФОТО СКОРО</text>
</svg>`;

mkdirSync("public/images/products", { recursive: true });
for (const [name, cfg] of Object.entries(products)) {
  writeFileSync(`public/images/products/${name}.svg`, productSvg(cfg));
}

const moods = {
  chocolate: { bg: "#EFE7DE", art: `${bar(30, 96, 118, 46, -8, CHOCO_DARK, "")}${bar(112, 62, 118, 46, 12, CHOCO, "")}` },
  caramel: { bg: "#F3EADC", art: `${bar(36, 92, 122, 48, -5, "#B9793C", "")}${bar(108, 66, 122, 48, 10, "#D89B52", "")}` },
  coconut: {
    bg: "#F1F0E8",
    art: `<circle cx="130" cy="120" r="66" fill="#8A6247"/><circle cx="130" cy="120" r="46" fill="#F7F4EC"/>${dots(
      12, "#E4DCCB", 260, 240, 41,
    )}`,
  },
  fruity: {
    bg: "#F6EEDF",
    art: `<circle cx="98" cy="132" r="46" fill="#E8A33D"/><circle cx="158" cy="106" r="38" fill="#EFB55C"/><circle cx="176" cy="156" r="30" fill="#C4405A"/>`,
  },
  "nuts-berries": {
    bg: "#F0EFE4",
    art: `<ellipse cx="100" cy="130" rx="34" ry="46" transform="rotate(-18 100 130)" fill="#C79A72"/><circle cx="164" cy="112" r="28" fill="#B03B4E"/><circle cx="176" cy="160" r="24" fill="#8E2F40"/>`,
  },
};

mkdirSync("public/images/moods", { recursive: true });
for (const [name, cfg] of Object.entries(moods)) {
  writeFileSync(
    `public/images/moods/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 240" width="260" height="240">
  <rect width="260" height="240" fill="${cfg.bg}"/>
  ${cfg.art}
</svg>`,
  );
}

const heroBars = [
  [70, 330, -6], [250, 296, 8], [140, 250, 14], [300, 218, -10],
  [110, 176, 4], [268, 142, 11], [180, 100, -8],
].map(([x, y, r], i) =>
  bar(x, y, 200, 78, r, i % 2 ? CHOCO : CHOCO_DARK, dots(4, "#D9A566", 200, 78, i * 9)),
).join("");

mkdirSync("public/images/hero", { recursive: true });
writeFileSync(
  "public/images/hero/bars.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" width="600" height="480">
  <rect width="600" height="480" fill="#DDE3CE"/>
  <ellipse cx="300" cy="424" rx="220" ry="30" fill="#2F3A2A" opacity="0.08"/>
  ${heroBars}
  ${dots(9, "#D9A566", 600, 470, 61)}
</svg>`,
);

mkdirSync("public/images/delivery", { recursive: true });
writeFileSync(
  "public/images/delivery/box.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 460" width="600" height="460">
  <rect width="600" height="460" fill="#EFEADC"/>
  <ellipse cx="300" cy="404" rx="210" ry="26" fill="#2F3A2A" opacity="0.08"/>
  <rect x="118" y="196" width="364" height="196" rx="18" fill="#F7F4EC" stroke="#DCD5C4" stroke-width="3"/>
  <rect x="96" y="150" width="408" height="62" rx="14" fill="#FBF9F4" stroke="#DCD5C4" stroke-width="3"/>
  <text x="300" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="26"
        letter-spacing="6" fill="#5B6B48">FitSweet</text>
  ${Array.from({ length: 8 }, (_, i) =>
    bar(146 + (i % 4) * 82, 232 + Math.floor(i / 4) * 78, 68, 58, 0, i % 2 ? CHOCO : CHOCO_DARK, ""),
  ).join("")}
</svg>`,
);

mkdirSync("public/images/instagram", { recursive: true });
const igBg = ["#EFE7DE", "#E7EADD", "#F1EADF", "#E4E9D8", "#F2EEE4"];
for (let i = 0; i < 5; i++) {
  writeFileSync(
    `public/images/instagram/${i + 1}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="${igBg[i]}"/>
  ${bar(70, 210, 170, 64, -7 + i * 3, i % 2 ? CHOCO : CHOCO_DARK, dots(4, "#D9A566", 170, 64, i * 13))}
  ${bar(150, 140, 170, 64, 6 - i * 2, i % 2 ? CHOCO_DARK : CHOCO, dots(3, "#F3EDE2", 170, 64, i * 17))}
  ${dots(6, "#8A9B6E", 400, 400, i * 7)}
</svg>`,
  );
}

console.log("Заглушки сгенерированы: 8 товаров, 5 настроений, hero, коробка, 5 Instagram");

/** Manual, deterministic SVG → PNG generation. Never imported by the build. */
import { Resvg } from "@resvg/resvg-js";
import wawoff2 from "wawoff2";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productName, shareImage } from "../src/content/site.js";

const require = createRequire(import.meta.url);
const tokens = await readFile(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
const colour = (name) => {
  const value = tokens.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
  if (!value) throw new Error(`Missing colour token: ${name}`);
  return value;
};
const xml = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );
const ground = colour("bg-dark");
const primary = colour("primary");
const accent = colour("accent");
const white = colour("text-inverse");
const muted = colour("text-on-dark");
const logo = (
  await readFile(
    new URL("../design-system/assets/logo/era-technologies-logo-white.png", import.meta.url),
  )
).toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <radialGradient id="glow"><stop stop-color="${primary}" stop-opacity=".72"/><stop offset="1" stop-color="${primary}" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="${accent}" opacity=".14"/></pattern>
  <linearGradient id="fade"><stop stop-color="${white}" stop-opacity=".3"/><stop offset="1" stop-color="${white}"/></linearGradient>
  <mask id="grid-fade"><rect width="1200" height="630" fill="url(#fade)"/></mask>
</defs>
<rect width="1200" height="630" fill="${ground}"/>
<ellipse cx="952" cy="292" rx="536" ry="440" fill="url(#glow)"/>
<rect width="1200" height="630" fill="url(#dots)" mask="url(#grid-fade)"/>
<g fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".32">
  <path d="M848 92h104l48 48v64h104M912 92v64l40 40v56h168M1120 280h-96l-48 48v160M1120 308h-64l-52 52v152M848 512h64l36-36v-72M824 512v-64l48-48v-72h-48"/>
  <rect x="800" y="224" width="112" height="104" rx="8"/>
  <path d="M824 224v-24m24 24v-24m24 24v-24m24 24v-24M824 328v24m24-24v24m24-24v24m24-24v24M800 248h-24m24 24h-24m24 24h-24M912 248h24m-24 24h24m-24 24h24"/>
  <circle cx="1104" cy="204" r="6"/><circle cx="1120" cy="252" r="6"/><circle cx="976" cy="488" r="6"/><circle cx="1004" cy="512" r="6"/><circle cx="848" cy="92" r="6"/>
</g>
<g font-family="Inter" font-weight="600">
  <image href="data:image/png;base64,${logo}" x="72" y="180" width="192" height="112"/>
  <text x="296" y="254" font-size="52" fill="${accent}">·</text>
  <text x="336" y="254" font-size="52" fill="${white}">${xml(productName)}</text>
  <text x="72" y="344" font-size="28" font-weight="400" fill="${muted}">${xml(shareImage.subtitle)}</text>
</g>
<path d="M72 392h80" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
</svg>`;

// resvg reads TTF; decompress the installed Fontsource WOFF2 into a short-lived local file.
const directory = await mkdtemp(path.join(tmpdir(), "eratech-og-"));
const resolved = path.resolve(directory);
if (
  path.dirname(resolved) !== path.resolve(tmpdir()) ||
  !path.basename(resolved).startsWith("eratech-og-")
) {
  throw new Error("Temporary directory is outside the expected location");
}
try {
  const woff = await readFile(
    require.resolve("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"),
  );
  const font = path.join(directory, "inter.ttf");
  await writeFile(font, await wawoff2.decompress(woff));
  const options = {
    font: { fontFiles: [font], loadSystemFonts: false, defaultFontFamily: "Inter" },
  };
  // Fail instead of silently rendering missing text if the font cannot be loaded.
  const probe = new Resvg(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="0" y="30" font-family="Inter" font-size="24">ERA</text></svg>',
    options,
  );
  if (!probe.innerBBox()) throw new Error("Inter font did not load");
  const rendered = new Resvg(svg, options).render();
  const png = rendered.asPng();
  if (
    rendered.width !== shareImage.width ||
    rendered.height !== shareImage.height ||
    png.length >= 300_000
  ) {
    throw new Error("Share image must be 1200 × 630 and under 300 KB");
  }
  const output = new URL(`../public${shareImage.path}`, import.meta.url);
  await writeFile(output, png);
  console.log(`Share image: ${fileURLToPath(output)} (${png.length} bytes)`);
} finally {
  await rm(directory, { recursive: true, force: true });
}

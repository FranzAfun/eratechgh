/**
 * pnpm check:contrast — measures every colour pair the site uses (WCAG 2.x) and fails below AA:
 * 4.5 for words, 3 for UI parts (borders, focus rings) and large text.
 *
 * Colours come from src/styles/tokens.css (`token:name` → --name), or are literal (#hex / rgb()).
 * A background can be a stack, top first: ["rgb(9 3 17 / 0.8)", "#ffffff"] = glass over white.
 * Add a pair here whenever a new colour combination ships.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url)),
  "utf8",
);

export function tokenValue(name) {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`Unknown token --${name}`);
  return m[1].trim();
}

export function parseColor(input) {
  const value = input.startsWith("token:") ? tokenValue(input.slice(6)) : input;
  let m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  m = value.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/i,
  );
  if (m) {
    let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [Number(m[1]), Number(m[2]), Number(m[3]), a];
  }
  throw new Error(`Can't parse colour "${input}" (${value})`);
}

/** Flattens a stack of colours (top first) onto an opaque base. */
export function flatten(stack) {
  const layers = (Array.isArray(stack) ? stack : [stack]).map(parseColor).reverse();
  let [r, g, b, a] = layers[0];
  if (a !== 1) throw new Error("The bottom background layer must be opaque");
  for (const [lr, lg, lb, la] of layers.slice(1)) {
    r = lr * la + r * (1 - la);
    g = lg * la + g * (1 - la);
    b = lb * la + b * (1 - la);
  }
  return [r, g, b];
}

function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function ratio(fg, bg) {
  const back = flatten(bg);
  const front = flatten([fg, ...(Array.isArray(bg) ? bg : [bg])]);
  const [hi, lo] = [luminance(front), luminance(back)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const T = (name) => `token:color-${name}`;
const GLASS = "rgb(9 3 17 / 0.8)"; // --glass-bg
const GLASS_FILL = "rgb(255 255 255 / 0.06)"; // --glass-fill
const LIGHT = ["background", "surface-soft", "surface-strong"].map(T);
const DARK = ["bg-dark", "surface-dark", "primary-deep", "primary", "primary-hover"].map(T);

/** [what, foreground, background (stack), kind] — kind: "text" (4.5) or "ui" (3). */
export const PAIRS = [
  // Light sections
  ...LIGHT.flatMap((bg) => [
    ["text primary", T("text-primary"), bg, "text"],
    ["text secondary", T("text-secondary"), bg, "text"],
    ["text muted", T("text-muted"), bg, "text"],
    ["brand words", T("primary-text"), bg, "text"],
    ["input border", T("ui-border"), bg, "ui"],
    ["focus ring", T("focus-ring"), bg, "ui"],
  ]),
  ["error words", T("danger-text"), T("background"), "text"],
  ["success words", T("success-text"), T("background"), "text"],
  ["brand words on hover", T("primary-text"), T("surface-hover"), "text"],
  ["white on primary button", T("on-primary"), T("primary"), "text"],
  ["white on primary hover", T("on-primary"), T("primary-hover"), "text"],

  // Dark grounds
  ...DARK.flatMap((bg) => [
    ["white on dark", T("text-inverse"), bg, "text"],
    ["muted on dark", T("text-on-dark"), bg, "text"],
    ["lilac on dark", T("accent"), bg, "text"],
    ["lilac focus ring on dark", T("accent"), bg, "ui"],
  ]),
  ["on-dark primary button", T("primary"), T("on-primary"), "text"],
  ["on-dark primary button hover", T("primary"), T("surface-hover"), "text"],

  // Glass header over the dark hero and over light pages (worst case: white behind it)
  ["white on glass over dark", T("text-inverse"), [GLASS, T("bg-dark")], "text"],
  ["white on glass over white", T("text-inverse"), [GLASS, T("background")], "text"],
  ["muted on glass over white", T("text-on-dark"), [GLASS, T("background")], "text"],
  [
    "nav white 82 % on glass over white",
    "rgb(255 255 255 / 0.82)",
    [GLASS, T("background")],
    "text",
  ],
  ["nav white 82 % on dark", "rgb(255 255 255 / 0.82)", T("bg-dark"), "text"],
  ["lilac on glass over white", T("accent"), [GLASS, T("background")], "text"],

  // Glass buttons and tiles on dark
  ["white on glass button (bg-dark)", T("text-inverse"), [GLASS_FILL, T("bg-dark")], "text"],
  ["white on glass button (deep)", T("text-inverse"), [GLASS_FILL, T("primary-deep")], "text"],
  ["muted on glass tile (deep)", T("text-on-dark"), [GLASS_FILL, T("primary-deep")], "text"],
  ["muted on glass tile (bg-dark)", T("text-on-dark"), [GLASS_FILL, T("bg-dark")], "text"],
];

function main() {
  let failures = 0;
  for (const [what, fg, bg, kind] of PAIRS) {
    const r = ratio(fg, bg);
    const min = kind === "ui" ? 3 : 4.5;
    const ok = r >= min;
    if (!ok) failures++;
    const bgName = (Array.isArray(bg) ? bg : [bg]).join(" over ").replaceAll("token:color-", "");
    console.log(
      `${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)} (min ${min})  ${what}: ${fg.replace("token:color-", "")} on ${bgName}`,
    );
  }
  console.log(`\n${PAIRS.length} pairs, ${failures} below AA.`);
  if (failures) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();

import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { site } from "./site.js";

describe("ERA Store logo files", () => {
  it.each(["era-store-logo-wide-purple.svg", "era-store-symbol-white.svg"])(
    "%s is copied unchanged from the design system",
    (file) => {
      const original = readFileSync(`design-system/era-store-logo/${file}`);
      const copy = readFileSync(`public/era-store/${file}`);
      expect(copy.equals(original)).toBe(true);
    },
  );
});

const publicFile = (url) => new URL(`../../public${url}`, import.meta.url);
const pngSize = (bytes) => [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];

function webpSize(bytes) {
  // Dimensions from the WebP container; no browser or image-library test dependency.
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (type === "VP8X")
      return [bytes.readUIntLE(start + 4, 3) + 1, bytes.readUIntLE(start + 7, 3) + 1];
    if (type === "VP8 ")
      return [bytes.readUInt16LE(start + 6) & 0x3fff, bytes.readUInt16LE(start + 8) & 0x3fff];
    if (type === "VP8L") {
      const bits = bytes.readUInt32LE(start + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = start + size + (size % 2);
  }
  throw new Error("WebP dimensions missing");
}

describe("approved brand and work assets", () => {
  it("keeps trimmed originals in all three supplied colours", () => {
    for (const colour of ["black", "purple", "white"]) {
      const file = new URL(
        `../../design-system/assets/logo/era-technologies-logo-${colour}.png`,
        import.meta.url,
      );
      expect(pngSize(readFileSync(file))).toEqual([1190, 693]);
    }
  });

  it("provides fixed-size logo fallbacks at the approved display heights and 2x", () => {
    for (const [role, height] of [
      ["header", 40],
      ["drawer", 36],
      ["footer", 48],
    ]) {
      const logo = site.logo[role];
      expect(logo.height).toBe(height);
      for (const [file, density] of logo.fallbackSrcSet
        .split(", ")
        .map((candidate) => candidate.split(" "))) {
        const scale = parseInt(density, 10);
        expect(pngSize(readFileSync(publicFile(file)))).toEqual([
          logo.width * scale,
          height * scale,
        ]);
      }
      for (const [file, density] of logo.srcSet
        .split(", ")
        .map((candidate) => candidate.split(" "))) {
        const scale = parseInt(density, 10);
        expect(webpSize(readFileSync(publicFile(file)))).toEqual([
          logo.width * scale,
          height * scale,
        ]);
      }
    }
    expect(pngSize(readFileSync(publicFile(site.logo.email.src)))).toEqual([240, 140]);
  });

  it("uses the ERA crop favicon files and removes the old SVG", () => {
    expect(existsSync(publicFile("/favicon.svg"))).toBe(false);
    expect(pngSize(readFileSync(publicFile("/favicon.png")))).toEqual([32, 32]);
    expect(pngSize(readFileSync(publicFile("/apple-touch-icon.png")))).toEqual([180, 180]);
    const ico = readFileSync(publicFile("/favicon.ico"));
    expect(ico.readUInt16LE(4)).toBe(3);
    expect([0, 1, 2].map((index) => [ico[6 + index * 16], ico[7 + index * 16]])).toEqual([
      [16, 16],
      [32, 32],
      [48, 48],
    ]);
  });

  it("ships work derivatives at 640 and native width, without upscaling or exceeding 400 KB", () => {
    expect(site.portfolio.map((image) => image.width)).toEqual([
      1029, 1080, 1280, 1280, 1280, 1280,
    ]);
    for (const image of site.portfolio) {
      const sources = image.srcSet.split(", ").map((source) => source.split(" "));
      expect(sources.map(([, width]) => parseInt(width, 10))).toEqual([640, image.width]);
      for (const [file, descriptor] of sources) {
        const width = parseInt(descriptor, 10);
        const bytes = readFileSync(publicFile(file));
        expect(bytes.length).toBeLessThanOrEqual(400_000);
        const [actualWidth, actualHeight] = webpSize(bytes);
        expect(actualWidth).toBe(width);
        expect(Math.abs(actualHeight - (image.height * width) / image.width)).toBeLessThanOrEqual(
          0.5,
        );
      }
    }
  });

  it("ships five local icon variants with public social URLs and no tracking parameters", () => {
    expect(site.socials.map((social) => social.name)).toEqual([
      "LinkedIn",
      "X",
      "Instagram",
      "TikTok",
      "WhatsApp",
    ]);
    for (const social of site.socials) {
      expect(new URL(social.url).protocol).toBe("https:");
      expect(new URL(social.url).search).toBe("");
      for (const key of ["icon", "icon2x", "png", "png2x", "emailIcon"])
        expect(existsSync(publicFile(social[key]))).toBe(true);
      expect(pngSize(readFileSync(publicFile(social.emailIcon)))).toEqual([48, 48]);
    }
  });
});

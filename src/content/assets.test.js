import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

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

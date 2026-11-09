import { describe, expect, it } from "vitest";
import { PAIRS, ratio } from "./check-contrast.js";

describe("check-contrast", () => {
  it("matches published ratios", () => {
    expect(ratio("#ffffff", "#3b1174")).toBeCloseTo(13.83, 1);
    expect(ratio("#d0adff", "#040108")).toBeCloseTo(10.96, 1);
  });
  it("flattens translucent layers", () => {
    // 50 % black over white ≈ #808080 → 3.95 against white text
    expect(ratio("#ffffff", ["rgb(0 0 0 / 0.5)", "#ffffff"])).toBeCloseTo(3.98, 1);
  });
  it("every pair the site uses passes AA", () => {
    for (const [what, fg, bg, kind] of PAIRS) {
      expect(ratio(fg, bg), what).toBeGreaterThanOrEqual(kind === "ui" ? 3 : 4.5);
    }
  });
});

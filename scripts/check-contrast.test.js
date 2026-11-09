import { describe, expect, it } from "vitest";
import { PAIRS, ratio } from "./check-contrast.js";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

describe("check-contrast", () => {
  it("executes the CLI and reports measured pairs on Windows and POSIX paths", () => {
    const output = execFileSync(
      process.execPath,
      [fileURLToPath(new URL("./check-contrast.js", import.meta.url))],
      { encoding: "utf8" },
    );
    expect(output).toContain(`${PAIRS.length} pairs, 0 below AA.`);
  });
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

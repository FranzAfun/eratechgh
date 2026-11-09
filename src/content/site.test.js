import { describe, expect, it } from "vitest";
import { hasPortfolio, site, visibleNav } from "./site.js";

describe("site content", () => {
  it("never invents unknown values", () => {
    expect(site.privacyUrl).toBeNull();
    expect(site.teamEmail).toBeNull();
    expect(site.portfolio).toEqual([]);
  });

  it("hides Our work until there are 3 photos", () => {
    expect(hasPortfolio()).toBe(false);
    expect(visibleNav().map((n) => n.hash)).not.toContain("work");
    const three = { ...site, portfolio: [{}, {}, {}] };
    expect(hasPortfolio(three)).toBe(true);
    expect(visibleNav(three).map((n) => n.hash)).toContain("work");
  });

  it('never says "ERA AXIS"', () => {
    expect(JSON.stringify(site)).not.toMatch(/ERA AXIS/i);
  });
});

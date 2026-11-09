import { describe, expect, it } from "vitest";
import { hasPortfolio, site, visibleNav } from "./site.js";

describe("site content", () => {
  it("never invents unknown values", () => {
    expect(site.privacyUrl).toBe("https://eraaxis.com/privacy");
    expect(site.teamEmail).toBeNull();
    expect(site.portfolio).toHaveLength(6);
  });

  it("shows Our work only when at least 3 real photographs are available", () => {
    expect(hasPortfolio()).toBe(true);
    expect(visibleNav().map((n) => n.hash)).toContain("work");
    const photos = site.portfolio.filter((image) => image.kind === "photo");
    const drawn = site.portfolio.filter((image) => image.kind !== "photo");
    for (const portfolio of [[], drawn, [...photos.slice(0, 2), ...drawn]]) {
      const insufficient = { ...site, portfolio };
      expect(hasPortfolio(insufficient)).toBe(false);
      expect(visibleNav(insufficient).map((n) => n.hash)).not.toContain("work");
    }
    expect(hasPortfolio({ ...site, portfolio: photos })).toBe(true);
  });

  it("uses each approved image once across three stories and labels non-photos", () => {
    const ids = site.home.work.stories.flatMap((story) => story.imageIds);
    expect(site.home.work.stories.map((story) => story.imageIds.length)).toEqual([2, 3, 1]);
    expect(new Set(ids).size).toBe(6);
    expect(ids).toEqual(site.portfolio.map((image) => image.id));
    for (const image of site.portfolio.filter((image) => image.kind !== "photo")) {
      expect(image.caption).toMatch(/CAD|layout|render/);
    }
  });

  it("keeps the names in one place", () => {
    expect(site.brandName).toBe("ERA Tech");
    expect(site.productName).toBe("Project Desk");
    expect(site.legalName).toBe("ERA Technologies");
    expect(site.siteTitle).toBe("ERA Tech · Project Desk");
    expect(site.home.hero.eyebrow).toBe(site.productName);
    expect(site.footer.copyright(2026)).toBe("© 2026 ERA Technologies. All rights reserved.");
    expect(site.request.consent.before).toMatch(/^I agree to ERA Technologies using these details/);
  });

  it('never says "ERA AXIS"', () => {
    expect(JSON.stringify(site)).not.toMatch(/ERA AXIS/i);
  });
});

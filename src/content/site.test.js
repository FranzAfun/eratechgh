import { describe, expect, it } from "vitest";
import { hasPortfolio, site, visibleNav } from "./site.js";

describe("site content", () => {
  it("never invents unknown values", () => {
    expect(site.privacyUrl).toBe("https://eraaxis.com/privacy");
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

  it("keeps the names in one place", () => {
    expect(site.brandName).toBe("ERA Tech");
    expect(site.productName).toBe("Project Desk");
    expect(site.legalName).toBe("ERA Technologies");
    expect(site.siteTitle).toBe("ERA Tech · Project Desk");
    expect(site.footer.copyright(2026)).toBe("© 2026 ERA Technologies. All rights reserved.");
    expect(site.request.consent.before).toMatch(/^I agree to ERA Technologies using these details/);
  });

  it('never says "ERA AXIS"', () => {
    expect(JSON.stringify(site)).not.toMatch(/ERA AXIS/i);
  });
});

import { describe, expect, it } from "vitest";
import { pageMeta } from "./meta.js";

describe("page titles", () => {
  it("home is the site title, other pages end with it", () => {
    expect(pageMeta(null, "d")[0].title).toBe("ERA Tech · Project Desk");
    expect(pageMeta("Start a request", "d")[0].title).toBe(
      "Start a request · ERA Tech · Project Desk",
    );
  });

  it("normalises canonical paths and shares the same absolute image on every route", () => {
    for (const path of [
      "/",
      "/request",
      "/request/sourcing",
      "/request/assessment",
      "/request/consultation",
    ]) {
      const meta = pageMeta(null, "Description", `${path}/?sample=1#details`);
      const url = `https://eratechgh.com${path === "/" ? "" : path}`;
      expect(meta.find((m) => m.rel === "canonical").href).toBe(url);
      expect(meta.find((m) => m.property === "og:url").content).toBe(url);
      expect(meta.find((m) => m.property === "og:image").content).toBe(
        "https://eratechgh.com/og.png",
      );
      expect(meta.find((m) => m.name === "twitter:image").content).toBe(
        "https://eratechgh.com/og.png",
      );
    }
  });

  it("404 metadata forbids indexing and has no canonical", () => {
    const meta = pageMeta("Page not found", "Description", "/404", { noindex: true });
    expect(meta).toContainEqual({ name: "robots", content: "noindex" });
    expect(meta.some((m) => m.rel === "canonical")).toBe(false);
  });
});

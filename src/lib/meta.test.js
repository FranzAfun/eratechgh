import { describe, expect, it } from "vitest";
import { pageMeta } from "./meta.js";

describe("page titles", () => {
  it("home is the site title, other pages end with it", () => {
    expect(pageMeta(null, "d")[0].title).toBe("ERA Tech · Project Desk");
    expect(pageMeta("Start a request", "d")[0].title).toBe(
      "Start a request · ERA Tech · Project Desk",
    );
  });
});

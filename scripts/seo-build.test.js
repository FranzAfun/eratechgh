/** Integration checks against real prerender output: run pnpm build before pnpm test. */
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const build = new URL("../build/client/", import.meta.url);
const routes = ["", "request", "request/sourcing", "request/assessment", "request/consultation"];
const read = (file) => readFileSync(new URL(file, build), "utf8");
const head = (html) => html.split("</head>")[0];
const tags = (html, tag) =>
  [...head(html).matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map((m) => {
    return Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]));
  });
const metaValue = (html, key) =>
  tags(html, "meta").find((m) => m.property === key || m.name === key)?.content;

describe("prerendered SEO", () => {
  it.each(routes)("%s has one absolute canonical and all sharing fields", (route) => {
    const html = read(route ? `${route}/index.html` : "index.html");
    const url = `https://eratechgh.com${route ? `/${route}` : ""}`;
    expect(tags(html, "link").filter((m) => m.rel === "canonical")).toEqual([
      { rel: "canonical", href: url },
    ]);
    expect(metaValue(html, "og:url")).toBe(url);
    expect(metaValue(html, "og:title")).toBe(head(html).match(/<title>(.*?)<\/title>/)[1]);
    expect(metaValue(html, "og:description")).toBe(metaValue(html, "description"));
    expect(metaValue(html, "og:type")).toBe("website");
    expect(metaValue(html, "og:site_name")).toBe("ERA Tech · Project Desk");
    expect(metaValue(html, "og:locale")).toBe("en_GB");
    expect(metaValue(html, "og:image")).toBe("https://eratechgh.com/og.png");
    expect(metaValue(html, "og:image:width")).toBe("1200");
    expect(metaValue(html, "og:image:height")).toBe("630");
    expect(metaValue(html, "og:image:alt")).toBeTruthy();
    expect(metaValue(html, "twitter:card")).toBe("summary_large_image");
    expect(metaValue(html, "twitter:title")).toBe(metaValue(html, "og:title"));
    expect(metaValue(html, "twitter:description")).toBe(metaValue(html, "description"));
    expect(metaValue(html, "twitter:image")).toBe("https://eratechgh.com/og.png");
    expect(metaValue(html, "robots")).toBeUndefined();
  });

  it.each(["404/index.html", "404.html"])(
    "%s has noindex, absolute sharing and no canonical",
    (file) => {
      const html = read(file);
      expect(metaValue(html, "robots")).toBe("noindex");
      expect(tags(html, "link").filter((m) => m.rel === "canonical")).toHaveLength(0);
      expect(metaValue(html, "og:url")).toBe("https://eratechgh.com/404");
      expect(metaValue(html, "og:image")).toBe("https://eratechgh.com/og.png");
    },
  );

  it("covers all content pages; the framework SPA fallback is an empty shell", () => {
    const files = readdirSync(build, { recursive: true })
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replaceAll("\\", "/"))
      .sort();
    expect(files).toEqual(
      [
        ...routes.map((route) => (route ? `${route}/index.html` : "index.html")),
        "404/index.html",
        "404.html",
        "__spa-fallback.html",
      ].sort(),
    );
    expect(read("__spa-fallback.html")).not.toContain('<link rel="canonical"');
  });

  it("ships crawl directives and exactly the five public sitemap URLs", () => {
    expect(read("robots.txt")).toBe(
      "User-agent: *\nAllow: /\nSitemap: https://eratechgh.com/sitemap.xml\n",
    );
    const urls = [...read("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(urls).toEqual(routes.map((route) => `https://eratechgh.com${route ? `/${route}` : ""}`));
  });

  it("ships the committed PNG at 1200 × 630 and below 300 KB", () => {
    const png = readFileSync(new URL("og.png", build));
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(300_000);
    expect(png).toEqual(readFileSync(new URL("../public/og.png", import.meta.url)));
  });
});
